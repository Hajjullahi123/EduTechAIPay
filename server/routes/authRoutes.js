const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'standalone_secret_123';

// Register a new SchoolGroup and Super Admin
router.post('/register', async (req, res) => {
    const { groupName, username, password, firstName, lastName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Use a transaction to ensure atomic group and user creation
        const result = await prisma.$transaction(async (tx) => {
            const group = await tx.schoolGroup.create({
                data: { name: groupName }
            });
            
            const user = await tx.user.create({
                data: {
                    username,
                    passwordHash: hashedPassword,
                    firstName,
                    lastName,
                    role: 'SUPER_ADMIN',
                    groupId: group.id
                }
            });
            
            return { user, group };
        });

        const token = jwt.sign(
            { userId: result.user.id, role: result.user.role, groupId: result.group.id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: result.user, group: result.group });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            include: { group: true }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, groupId: user.groupId },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user, group: user.group });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
