const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function run() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "public"."GamificationBadge" ADD COLUMN IF NOT EXISTS "xp" INTEGER NOT NULL DEFAULT 100;');
    console.log("Success");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
