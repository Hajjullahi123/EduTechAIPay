const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATA_PATH 
    ? `file:${path.join(process.env.DATA_PATH, 'dev.db')}`
    : `file:${path.join(__dirname, 'prisma/dev.db')}`,
  log: ['error', 'warn'],
});

prisma.$connect()
  .then(() => console.log('[DB] Local database connected.'))
  .catch((err) => console.error('[DB] Connection failed:', err));

module.exports = prisma;
