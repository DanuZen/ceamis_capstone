const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function run() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "public"."transactions" DROP CONSTRAINT IF EXISTS "transactions_tag_check";');
    console.log("Success");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
