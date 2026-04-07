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

// Delete a school branch
router.delete('/schools/:id', authenticate, superAdminOnly, async (req, res) => {
    const { id } = req.params;
    try {
        // Ensure the school belongs to the admin's group
        const school = await prisma.school.findFirst({
            where: { id: parseInt(id), groupId: req.user.groupId }
        });

        if (!school) {
            return res.status(404).json({ error: 'School not found or access denied' });
        }

        await prisma.school.delete({
            where: { id: parseInt(id) }
        });
        
        res.json({ message: 'School branch deleted successfully' });
    } catch (error) {
        // If there are foreign key constraints, Prisma will throw P2003
        res.status(400).json({ 
            error: 'Database integrity block: This school has active records (Staff, Students, or Payments) and cannot be deleted until those records are archived.' 
        });
    }
});

module.exports = router;
