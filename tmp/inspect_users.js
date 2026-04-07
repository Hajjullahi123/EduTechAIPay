const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { role: 'SUPER_ADMIN' },
    select: {
      id: true,
      username: true,
      role: true,
      isActive: true,
      groupId: true
    }
  });

  console.log('Super Admin Users:');
  console.log(JSON.stringify(users, null, 2));

  const allUsersCount = await prisma.user.count();
  console.log(`Total users in database: ${allUsersCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
