const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

const ID_MAP = {
  "Langkah Pertama": "firstStep",
  "Semangat!": "onFire",
  "Konsisten": "consistent",
  "Sang Juara": "champion",
  "Penjelajah AI": "aiExplorer",
  "Master Hemat": "hematMaster",
  "Rajin Belajar": "bookworm",
  "Legendaris": "legendary"
};

async function run() {
  try {
    for (const [name, id] of Object.entries(ID_MAP)) {
      await prisma.$executeRawUnsafe(`UPDATE "GamificationBadge" SET id = $1 WHERE name = $2`, id, name);
      console.log(`Updated ${name} to id ${id}`);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
