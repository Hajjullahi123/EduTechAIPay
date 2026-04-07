const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

console.log('🚀 Starting Standalone FinSchool Pro in Dev Mode...');

// Start Vite
const vite = spawn('node', [path.join('node_modules', 'vite', 'bin', 'vite.js')], {
  shell: true,
  stdio: 'inherit'
});

vite.on('error', (err) => {
  console.error('❌ Failed to start Vite:', err);
});

// Helper to check if Vite is ready
function checkVite() {
  const req = http.request({
    host: 'localhost',
    port: 5174,
    path: '/',
    method: 'GET'
  }, (res) => {
    console.log('✅ Vite is ready! Starting Electron...');
    startElectron();
  });

  req.on('error', () => {
    // Retry
    setTimeout(checkVite, 1000);
  });

  req.end();
}

function startElectron() {
  const electronBin = process.platform === 'win32' 
    ? path.join('node_modules', 'electron', 'dist', 'electron.exe')
    : path.join('node_modules', 'electron', 'dist', 'electron');
  
  const electron = spawn(electronBin, ['.'], {
    shell: true,
    stdio: 'inherit'
  });

  electron.on('close', (code) => {
    console.log(`🔌 Electron closed with code ${code}. Terminating Vite...`);
    vite.kill();
    process.exit(code);
  });
}

// Start checking
checkVite();
