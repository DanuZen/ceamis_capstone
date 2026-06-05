const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function run() {
  try {
    const res = await prisma.$queryRawUnsafe("SELECT pg_get_constraintdef(oid) FROM pg_constraint WHERE conname = 'transactions_tag_check'");
    console.log(res);
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
