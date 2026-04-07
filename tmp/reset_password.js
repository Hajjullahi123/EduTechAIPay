const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const newPassword = 'topuser2026';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const updated = await prisma.user.update({
    where: { username: 'Hajjullahi' },
    data: { passwordHash: hashedPassword },
    select: { id: true, username: true, role: true }
  });

  console.log('Password reset successful for:', updated);
  console.log(`New password: ${newPassword}`);

  // Verify the new password works
  const user = await prisma.user.findUnique({ where: { username: 'Hajjullahi' } });
  const match = await bcrypt.compare(newPassword, user.passwordHash);
  console.log(`Verification - password matches: ${match}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
