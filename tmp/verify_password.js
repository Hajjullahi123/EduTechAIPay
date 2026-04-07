const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { username: 'Hajjullahi' },
    select: { id: true, username: true, passwordHash: true, role: true }
  });

  if (!user) {
    console.log('User "Hajjullahi" NOT FOUND in the database.');
    return;
  }

  console.log('User found:', { id: user.id, username: user.username, role: user.role });
  console.log('Password hash:', user.passwordHash);
  console.log('Hash length:', user.passwordHash.length);
  console.log('Hash starts with $2:', user.passwordHash.startsWith('$2'));

  // Test common passwords
  const testPasswords = ['topuser2026', 'password', 'admin', '123456', 'Hajjullahi'];
  for (const pw of testPasswords) {
    const match = await bcrypt.compare(pw, user.passwordHash);
    console.log(`Password "${pw}" matches: ${match}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
