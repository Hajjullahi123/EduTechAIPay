/**
 * PRODUCTION ENTRY POINT
 * This file is recognized by cPanel / QServers Node.js selector.
 * It simply boots the main server logic from the server directory.
 */

// Set production environment if not already set
process.env.NODE_ENV = 'production';

// Import and start the server
require('./server/index.js');
