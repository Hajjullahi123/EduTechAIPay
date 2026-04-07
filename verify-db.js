const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient({
  datasourceUrl: `file:${path.join(__dirname, 'server/prisma/dev.db')}`,
});

async function main() {
  try {
    const students = await prisma.student.findMany({
      take: 5,
      include: {
        school: true
      }
    });
    console.log('Database verification successful!');
    console.log(`Found ${students.length} students.`);
    students.forEach(s => {
      console.log(`- ${s.firstName} ${s.lastName} (${s.school.name})`);
    });
  } catch (e) {
    console.error('Database verification failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
