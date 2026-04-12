const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const DEFAULT_PORT = 3001;
let port = process.env.PORT || DEFAULT_PORT;

// Helper to find available port
const net = require('net');
async function findAvailablePort(startPort) {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.unref();
        server.on('error', () => resolve(findAvailablePort(startPort + 1)));
        server.listen(startPort, () => {
            server.close(() => resolve(startPort));
        });
    });
}

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const paymentRoutes = require('./routes/payment');
const branchRoutes = require('./routes/branchRoutes');
const miscRoutes = require('./routes/miscRoutes');
const scholarshipRoutes = require('./routes/scholarshipRoutes');
const bulkUploadRoutes = require('./routes/bulkUploadRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const systemRoutes = require('./routes/systemRoutes');
const communicationRoutes = require('./routes/communicationRoutes');
const { createBackup } = require('./services/backupService');
const { authenticate } = require('./middleware/auth');

app.use('/api/auth', authRoutes);
app.use('/api/super-admin', authenticate, superAdminRoutes);
app.use('/api/branches', authenticate, branchRoutes);
app.use('/api/payment', authenticate, paymentRoutes);
app.use('/api/misc-fees', authenticate, miscRoutes);
app.use('/api/scholarships', authenticate, scholarshipRoutes);
app.use('/api/bulk-upload', authenticate, bulkUploadRoutes);
app.use('/api/payroll', authenticate, payrollRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/comms', authenticate, communicationRoutes);

// PRODUCTION: Serve React Frontend
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// PRODUCTION: Support Client-side routing (SPAs)
app.get('*', (req, res) => {
    // If it's an API route that wasn't matched above, 404 it
    if (req.url.startsWith('/api/')) {
        return res.status(404).json({ error: 'API route not found' });
    }
    // Otherwise serve index.html
    res.sendFile(path.join(distPath, 'index.html'));
});

// Start server with port discovery
(async () => {
    // If not in production, or if no port provided by host, find one
    if (process.env.NODE_ENV !== 'production' && !process.env.PORT) {
        port = await findAvailablePort(DEFAULT_PORT);
    }
    
    // cPanel/QServers often passes the port via environment
    const actualPort = process.env.PORT || port;

    const server = app.listen(actualPort, () => {
        console.log(`EduTech Pro Suite running on port ${actualPort}`);
        // Notify Electron of the actual port being used
        if (process.send) process.send({ type: 'server-ready', port: actualPort }); 
        
        // FISCAL SNAPSHOT PROTOCOL: Initialize startup backup
        if (process.env.NODE_ENV === 'production') {
            console.log('[PROD] System initialized in production mode.');
        } else {
            createBackup('startup').catch(err => console.error('[STARTUP BACKUP ERROR]', err));
        }
    });

    process.on('SIGTERM', () => {
        server.close();
    });
})();
