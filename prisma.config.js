const { defineConfig } = require('@prisma/config');
const path = require('path');
require('dotenv').config();

module.exports = defineConfig({
  schema: path.join(__dirname, 'server/prisma/schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL || 'file:./server/prisma/dev.db'
  }
});
