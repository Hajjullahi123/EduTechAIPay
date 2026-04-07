const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const schoolName = args[0];

if (!schoolName) {
    console.error('❌ Error: Please provide a school name.');
    console.log('Usage: node issueLicense.js "Green Valley Academy"');
    process.exit(1);
}

const keysDir = path.join(__dirname, 'keys');
const privateKeyPath = path.join(keysDir, 'private.pem');

if (!fs.existsSync(privateKeyPath)) {
    console.error('❌ Error: private.pem not found. Run generateKeys.js first to generate your master keys.');
    process.exit(1);
}

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

// The payload to sign
const payload = {
    schoolName: schoolName.trim(),
    issuedAt: new Date().toISOString(),
    type: 'STANDALONE_PRO'
};

const payloadString = JSON.stringify(payload);

// Create signature using your private key
const sign = crypto.createSign('SHA256');
sign.update(payloadString);
sign.end();
const signature = sign.sign(privateKey, 'base64');

// Package the license (Base64 wrapper containing the readable payload + signature)
const licensePackage = {
    payload: payloadString,
    signature: signature
};

const finalLicenseKey = Buffer.from(JSON.stringify(licensePackage)).toString('base64');

console.log('\n======================================================');
console.log('🎓 EDUTECH PRO SUITE - OFFLINE LICENSE GENERATOR');
console.log('======================================================');
console.log(`School Name : ${payload.schoolName}`);
console.log(`Issue Date  : ${payload.issuedAt}`);
console.log('\n🔑 YOUR OFFLINE LICENSE KEY (Copy this to the client):\n');
console.log(finalLicenseKey);
console.log('\n======================================================\n');
