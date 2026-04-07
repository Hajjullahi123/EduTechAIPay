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

// Start server with port discovery
(async () => {
    if (!process.env.PORT) {
        port = await findAvailablePort(DEFAULT_PORT);
    }
    
    const server = app.listen(port, () => {
        console.log(`Standalone local backend running on port ${port}`);
        // Notify Electron of the actual port being used
        if (process.send) process.send({ type: 'server-ready', port }); 
        
        // FISCAL SNAPSHOT PROTOCOL: Initialize startup backup
        createBackup('startup').catch(err => console.error('[STARTUP BACKUP ERROR]', err));
    });

    process.on('SIGTERM', () => {
        server.close();
    });
})();
