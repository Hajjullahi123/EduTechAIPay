const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../prisma/dev.db');
const BACKUP_DIR = path.join(__dirname, '../backups');

const createBackup = async (label = 'auto') => {
    try {
        if (!fs.existsSync(BACKUP_DIR)) {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupName = `backup_${label}_${timestamp}.db`;
        const backupPath = path.join(BACKUP_DIR, backupName);

        fs.copyFileSync(DB_PATH, backupPath);
        console.log(`[BACKUP] Snapshot created: ${backupName}`);
        
        // Clean up redundant backups (keep last 30)
        const backups = fs.readdirSync(BACKUP_DIR)
            .filter(f => f.endsWith('.db'))
            .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime }))
            .sort((a, b) => b.time - a.time);

        if (backups.length > 30) {
            backups.slice(30).forEach(b => {
                fs.unlinkSync(path.join(BACKUP_DIR, b.name));
                console.log(`[BACKUP] Retiring legacy snapshot: ${b.name}`);
            });
        }

        return { success: true, name: backupName };
    } catch (error) {
        console.error('[BACKUP ERROR]', error);
        return { success: false, error: error.message };
    }
};

const listBackups = () => {
    if (!fs.existsSync(BACKUP_DIR)) return [];
    return fs.readdirSync(BACKUP_DIR)
        .filter(f => f.endsWith('.db'))
        .map(f => ({
            name: f,
            size: fs.statSync(path.join(BACKUP_DIR, f)).size,
            createdAt: fs.statSync(path.join(BACKUP_DIR, f)).mtime
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
};

const restoreBackup = async (backupName) => {
    try {
        const backupPath = path.join(BACKUP_DIR, backupName);
        if (!fs.existsSync(backupPath)) throw new Error('Backup file not found');

        // Snapshot current state before restore
        await createBackup('pre_restore');

        fs.copyFileSync(backupPath, DB_PATH);
        console.log(`[BACKUP] System restored to: ${backupName}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

module.exports = { createBackup, listBackups, restoreBackup };
