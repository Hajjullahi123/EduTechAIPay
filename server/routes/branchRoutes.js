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

module.exports = router;
