const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth');

const prisma = new PrismaClient();

// Only SUPER_ADMIN allowed
const superAdminOnly = (req, res, next) => {
    if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Super Admin access required' });
    }
    next();
};

// Create a new school branch with a default admin
router.post('/schools', authenticate, superAdminOnly, async (req, res) => {
    const { name, address, phone, email } = req.body;
    const bcrypt = require('bcryptjs');
    
    try {
        const result = await prisma.$transaction(async (tx) => {
            const school = await tx.school.create({
                data: {
                    name,
                    address,
                    phone,
                    email,
                    groupId: req.user.groupId
                }
            });

            // Create default admin for this school
            const username = `admin_${name.toLowerCase().replace(/\s+/g, '_')}_${school.id}`;
            const tempPassword = 'welcome2026';
            const passwordHash = await bcrypt.hash(tempPassword, 10);

            const admin = await tx.user.create({
                data: {
                    username,
                    firstName: 'School',
                    lastName: 'Admin',
                    role: 'SCHOOL_ADMIN',
                    passwordHash,
                    groupId: req.user.groupId,
                    schoolId: school.id
                }
            });

            return { school, admin, tempPassword };
        });

        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get group dashboard summary
router.get('/summary', authenticate, superAdminOnly, async (req, res) => {
    try {
        const schools = await prisma.school.findMany({
            where: { groupId: req.user.groupId },
            include: {
                _count: {
                    select: { students: true }
                }
            }
        });

        const totalStudents = schools.reduce((acc, s) => acc + s._count.students, 0);
        
        res.json({
            schoolCount: schools.length,
            totalStudents,
            branches: schools
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users in the group
router.get('/users', authenticate, superAdminOnly, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { groupId: req.user.groupId },
            include: {
                student: {
                    include: { classModel: true }
                },
                group: true,
                paymentsRecorded: { take: 5 }
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Register a new user globally
router.post('/users', authenticate, superAdminOnly, async (req, res) => {
    const { username, firstName, lastName, role, password, schoolId, admissionNumber, classId } = req.body;
    const bcrypt = require('bcryptjs');
    
    try {
        const passwordHash = await bcrypt.hash(password || 'password123', 10);
        
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    username,
                    firstName,
                    lastName,
                    role,
                    passwordHash,
                    groupId: req.user.groupId,
                    schoolId: schoolId ? parseInt(schoolId) : null
                }
            });

            if (role === 'STUDENT') {
                await tx.student.create({
                    data: {
                        userId: newUser.id,
                        schoolId: parseInt(schoolId),
                        admissionNumber: admissionNumber || `ADM-${Date.now()}`,
                        classId: classId ? parseInt(classId) : null,
                        firstName,
                        lastName
                    }
                });
            }

            return newUser;
        });

        res.json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a school branch (cascading)
router.delete('/schools/:id', authenticate, superAdminOnly, async (req, res) => {
    const schoolId = parseInt(req.params.id);
    try {
        // Ensure the school belongs to the admin's group
        const school = await prisma.school.findFirst({
            where: { id: schoolId, groupId: req.user.groupId }
        });

        if (!school) {
            return res.status(404).json({ error: 'School not found or access denied' });
        }

        // Cascade delete all dependent records in correct order within a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Delete payment-level records
            await tx.feePayment.deleteMany({ where: { schoolId } });
            await tx.miscellaneousPayment.deleteMany({ where: { schoolId } });

            // 2. Delete fee records & structures
            await tx.feeRecord.deleteMany({ where: { schoolId } });
            await tx.classFeeStructure.deleteMany({ where: { schoolId } });
            await tx.miscellaneousFee.deleteMany({ where: { schoolId } });

            // 3. Delete scholarship certificates
            await tx.scholarshipCertificate.deleteMany({ where: { schoolId } });

            // 4. Delete students (get IDs first to clean user links)
            const students = await tx.student.findMany({ where: { schoolId }, select: { userId: true } });
            await tx.student.deleteMany({ where: { schoolId } });

            // 5. Delete payroll records
            // VoucherItems reference StaffVoucher, so delete items first
            const vouchers = await tx.staffVoucher.findMany({ where: { schoolId }, select: { id: true } });
            if (vouchers.length > 0) {
                await tx.voucherItem.deleteMany({ where: { voucherId: { in: vouchers.map(v => v.id) } } });
            }
            await tx.staffVoucher.deleteMany({ where: { schoolId } });

            // 6. Delete staff complaints then staff
            const staffIds = await tx.staff.findMany({ where: { schoolId }, select: { id: true } });
            if (staffIds.length > 0) {
                await tx.staffComplaint.deleteMany({ where: { staffId: { in: staffIds.map(s => s.id) } } });
            }
            await tx.staff.deleteMany({ where: { schoolId } });

            // 7. Delete academic structure
            await tx.term.deleteMany({ where: { schoolId } });
            await tx.academicSession.deleteMany({ where: { schoolId } });
            await tx.class.deleteMany({ where: { schoolId } });

            // 8. Delete notifications & audit logs
            await tx.notification.deleteMany({ where: { schoolId } });
            await tx.auditLog.deleteMany({ where: { schoolId } });

            // 9. Delete users linked to this school (admins/bursars created for this branch)
            await tx.user.deleteMany({ where: { schoolId } });

            // 10. Also delete student user accounts
            if (students.length > 0) {
                await tx.user.deleteMany({ where: { id: { in: students.map(s => s.userId) } } });
            }

            // 11. Finally delete the school itself
            await tx.school.delete({ where: { id: schoolId } });
        });
        
        res.json({ message: `School branch "${school.name}" and all its records have been permanently deleted.` });
    } catch (error) {
        console.error('[DELETE SCHOOL ERROR]', error);
        res.status(400).json({ 
            error: `Failed to delete school: ${error.message}` 
        });
    }
});

// Regenerate/Reset user credentials
router.post('/users/:id/reset-password', authenticate, superAdminOnly, async (req, res) => {
    const { id } = req.params;
    const bcrypt = require('bcryptjs');
    const tempPassword = 'reset' + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    try {
        const passwordHash = await bcrypt.hash(tempPassword, 10);
        
        const user = await prisma.user.update({
            where: { id: parseInt(id), groupId: req.user.groupId },
            data: { passwordHash }
        });

        res.json({ 
            message: 'Credentials regenerated successfully', 
            username: user.username,
            tempPassword 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Academic Periods management
router.get('/academic-periods', authenticate, async (req, res) => {
    const schoolId = parseInt(req.query.schoolId);
    if (!schoolId) return res.status(400).json({ error: 'School ID required' });
    try {
        const sessions = await prisma.academicSession.findMany({
            where: { schoolId },
            include: { terms: true }
        });
        res.json(sessions);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

router.post('/academic-periods/sessions', authenticate, superAdminOnly, async (req, res) => {
    const { schoolId, name } = req.body;
    try {
        const session = await prisma.academicSession.create({
            data: { schoolId: parseInt(schoolId), name, isCurrent: false }
        });
        res.json(session);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

router.post('/academic-periods/terms', authenticate, superAdminOnly, async (req, res) => {
    const { schoolId, sessionId, name } = req.body;
    try {
        const term = await prisma.term.create({
            data: { 
                schoolId: parseInt(schoolId), 
                academicSessionId: parseInt(sessionId), 
                name, 
                isCurrent: false 
            }
        });
        res.json(term);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

router.patch('/academic-periods/sessions/:id/activate', authenticate, superAdminOnly, async (req, res) => {
    const id = parseInt(req.params.id);
    const { schoolId } = req.body;
    try {
        await prisma.$transaction([
            prisma.academicSession.updateMany({ where: { schoolId: parseInt(schoolId) }, data: { isCurrent: false } }),
            prisma.academicSession.update({ where: { id }, data: { isCurrent: true } })
        ]);
        res.json({ message: 'Session activated' });
    } catch (error) { res.status(400).json({ error: error.message }); }
});

router.patch('/academic-periods/terms/:id/activate', authenticate, superAdminOnly, async (req, res) => {
    const id = parseInt(req.params.id);
    const { schoolId, sessionId } = req.body;
    try {
        await prisma.$transaction([
            prisma.term.updateMany({ 
                where: { schoolId: parseInt(schoolId), academicSessionId: parseInt(sessionId) }, 
                data: { isCurrent: false } 
            }),
            prisma.term.update({ where: { id }, data: { isCurrent: true } })
        ]);
        res.json({ message: 'Term activated' });
    } catch (error) { res.status(400).json({ error: error.message }); }
});

module.exports = router;
