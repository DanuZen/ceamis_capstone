const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

const INITIAL_BADGES = [
  { name: "Langkah Pertama", icon: "Target", xp: 100, desc: "Catat transaksi pertamamu", requirementType: "transaction_count", requirementValue: 1 },
  { name: "Semangat!", icon: "Flame", xp: 150, desc: "Aktif 3 hari berturut-turut", requirementType: "login_streak", requirementValue: 3 },
  { name: "Konsisten", icon: "Zap", xp: 300, desc: "Aktif 7 hari berturut-turut", requirementType: "login_streak", requirementValue: 7 },
  { name: "Sang Juara", icon: "Target", xp: 500, desc: "Aktif 30 hari berturut-turut", requirementType: "login_streak", requirementValue: 30 },
  { name: "Penjelajah AI", icon: "Star", xp: 200, desc: "Baca 5 Wawasan AI", requirementType: "ai_insight", requirementValue: 5 },
  { name: "Master Hemat", icon: "Shield", xp: 400, desc: "Tekan pengeluaran hingga 20%", requirementType: "budget_kept", requirementValue: 20 },
  { name: "Rajin Belajar", icon: "Star", xp: 250, desc: "Selesaikan 3 modul edukasi", requirementType: "module_completed", requirementValue: 3 },
  { name: "Legendaris", icon: "Target", xp: 1000, desc: "Kumpulkan semua badge", requirementType: "badge_count", requirementValue: 7 },
];

async function run() {
  try {
    for (const badge of INITIAL_BADGES) {
      // Check if it exists by name to avoid duplicates
      const exists = await prisma.$queryRawUnsafe(`SELECT id FROM "GamificationBadge" WHERE name = $1`, badge.name);
      if (!exists || exists.length === 0) {
        await prisma.$executeRawUnsafe(`
          INSERT INTO "GamificationBadge" (id, name, "desc", icon, "requirementType", "requirementValue", xp, "createdAt", "updatedAt") 
          VALUES (uuid_generate_v4(), $1, $2, $3, $4, $5, $6, NOW(), NOW())
        `, badge.name, badge.desc, badge.icon, badge.requirementType, badge.requirementValue, badge.xp);
        console.log("Inserted:", badge.name);
      } else {
        console.log("Skipping duplicate:", badge.name);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
run();
