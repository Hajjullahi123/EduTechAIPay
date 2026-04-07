const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'standalone_secret_123';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains userId, role, groupId
        
        // Extract schoolId from headers, query, or body
        const schoolId = req.headers['x-school-id'] || req.query.schoolId || req.body.schoolId;
        req.schoolId = parseInt(schoolId) || (req.user.schoolId ? parseInt(req.user.schoolId) : null);
        
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const authorize = (roles = []) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        // Super Admins have global override
        if (userRole === 'SUPER_ADMIN') {
            return next();
        }
        
        // Map modern roles to legacy roles in routes
        const normalizedRole = userRole === 'SCHOOL_ADMIN' ? 'admin' 
                             : userRole === 'BURSAR' ? 'accountant' 
                             : userRole;

        if (!roles.length || roles.includes(userRole) || roles.includes(normalizedRole)) {
            return next();
        }
        res.status(403).json({ error: 'Unauthorized: Role mismatch' });
    };
};

module.exports = { authenticate, authorize };
