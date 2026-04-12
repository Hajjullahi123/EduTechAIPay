const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticate } = require('../middleware/auth');

// Get all branches/schools in the user's group
router.get('/', authenticate, async (req, res) => {
    try {
        if (!req.user.groupId) {
            // If user has no group, just return their current school
            const school = await prisma.school.findUnique({
                where: { id: req.schoolId }
            });
            return res.json(school ? [school] : []);
        }

        const schools = await prisma.school.findMany({
            where: { groupId: req.user.groupId },
            orderBy: { name: 'asc' }
        });
        res.json(schools);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a new branch (Allowed for SUPER_ADMIN or SCHOOL_ADMIN of the group)
router.post('/', authenticate, async (req, res) => {
    const { name, address, phone, email } = req.body;
    
    // Check if the user is authorized (Super Admin or School Admin of a group)
    if (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'SCHOOL_ADMIN') {
        return res.status(403).json({ error: 'Administrative authority required' });
    }

    if (!req.user.groupId) {
        return res.status(400).json({ error: 'User must belong to an organization to create branches' });
    }

    try {
        const school = await prisma.school.create({
            data: {
                name,
                address,
                phone,
                email,
                groupId: req.user.groupId
            }
        });
        res.json(school);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


module.exports = router;
