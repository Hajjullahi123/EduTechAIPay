const prisma = require('../db');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// The public key embedded directly in the application (DO NOT INCLUDE PRIVATE KEY HERE)
const EDUTECH_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtSGoB7VMTfpbb8VGfKX9
M9Lh4gmNAcC9CXp/2JW4hXnguGojo40Ahiv2ZMkEVPq7W5rmxRT7+5FAIfU9R9Qx
32nP0ulTTCiu5rYwpZT03TZLfHvB6uhd2Mieqd+6tNjOojeZlsqhaGAXW/lsv67e
smsYaDmUmpNu9yb+1Ln3/SAU/OpP4eUqQVDt+dtghUGHuPlV5Eepik/B7Kssdg6S
aXlwsRctxLqKmBV2hYKbCUD8mThy3VwFuDOuqw2eo/YrT7VPcQqmF+wN6mdkqrvV
IzrA8REga5WR7G+7WqezFEWEhpdAX/6QkuJEPJohUGnNevFQWbHx5YpJEMoTTyyS
5QIDAQAB
-----END PUBLIC KEY-----`;

/**
 * Checks if the system is fully initialized with at least one school and super admin.
 */
async function getSystemStatus() {
    try {
        const schoolCount = await prisma.school.count();
        const adminCount = await prisma.user.count({ where: { role: 'SUPER_ADMIN' } });
        
        return {
            isInitialized: schoolCount > 0 && adminCount > 0,
            schoolCount,
            adminCount
        };
    } catch (error) {
        // If tables don't exist yet, it's definitely not initialized
        return {
            isInitialized: false,
            error: error.message
        };
    }
}

/**
 * Initializes a standalone school instance.
 */
async function initializeStandalone(data) {
    const { schoolName, adminUsername, adminPassword, firstName, lastName, licenseKey } = data;

    if (!licenseKey) {
        throw new Error('License key is required.');
    }

    try {
        // Decode the wrapper
        const decodedKey = Buffer.from(licenseKey, 'base64').toString('utf8');
        const { payload, signature } = JSON.parse(decodedKey);
        
        // Cryptographically verify signature
        const verify = crypto.createVerify('SHA256');
        verify.update(payload);
        verify.end();
        
        const isValid = verify.verify(EDUTECH_PUBLIC_KEY, signature, 'base64');
        
        if (!isValid) {
            throw new Error('Cryptographic verification failed. This license is invalid or forged.');
        }
        
        // Ensure school name strictly matches
        const parsedPayload = JSON.parse(payload);
        if (parsedPayload.schoolName.trim().toLowerCase() !== schoolName.trim().toLowerCase()) {
            throw new Error(`License was issued to "${parsedPayload.schoolName}", but you entered "${schoolName}". They must match exactly.`);
        }
        
    } catch (e) {
        const msg = e.message.includes('JSON') || e.message.includes('base64') || e.message.includes('Unexpected') 
            ? 'License key format is unrecognizable or corrupted.' 
            : e.message;
        throw new Error(msg);
    }

    return await prisma.$transaction(async (tx) => {
        // 1. Create the School
        const school = await tx.school.create({
            data: {
                name: schoolName,
                address: 'Initialized Standalone',
                email: 'admin@local.com'
            }
        });

        // 2. Create the School Group (Logical container)
        const group = await tx.schoolGroup.create({
            data: { name: `${schoolName} Group` }
        });

        // 3. Update school with group
        await tx.school.update({
            where: { id: school.id },
            data: { groupId: group.id }
        });

        // 4. Create the Super Admin (The owner of this standalone instance)
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const user = await tx.user.create({
            data: {
                username: adminUsername,
                passwordHash: hashedPassword,
                firstName,
                lastName,
                role: 'SUPER_ADMIN',
                groupId: group.id,
                schoolId: school.id
            }
        });

        return { school, user };
    });
}

module.exports = {
    getSystemStatus,
    initializeStandalone
};
