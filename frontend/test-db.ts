import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const modules = await prisma.educationModule.count();
    const badges = await prisma.gamificationBadge.count();
    const profiles = await prisma.riskProfile.count();
    console.log("Database connection successful!");
    console.log(`- EducationModules: ${modules}`);
    console.log(`- GamificationBadges: ${badges}`);
    console.log(`- RiskProfiles: ${profiles}`);
    console.log("All tables exist and are connected!");
  } catch (e) {
    console.error("Database Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
