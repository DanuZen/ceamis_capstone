"use server";

import prisma from "@/lib/prisma";

export async function getBudget(userId: string) {
  return await prisma.financialBudget.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function saveBudget(userId: string, limit: number) {
  const existing = await getBudget(userId);
  if (existing) {
    return await prisma.financialBudget.update({
      where: { id: existing.id },
      data: { limit }
    });
  } else {
    return await prisma.financialBudget.create({
      data: { userId, limit, period: "monthly" }
    });
  }
}

export async function getTargets(userId: string) {
  return await prisma.financialTarget.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function saveTargets(userId: string, targets: any[]) {
  // Overwrite approach: delete all and insert new. 
  // Alternatively, just do createMany.
  await prisma.financialTarget.deleteMany({
    where: { userId }
  });
  
  if (targets.length > 0) {
    await prisma.financialTarget.createMany({
      data: targets.map(t => ({
        userId,
        name: t.name,
        targetAmount: t.targetAmount,
        currentAmount: t.currentAmount || 0,
        deadline: t.deadline ? new Date(t.deadline) : null,
        icon: t.icon || "target",
        color: t.color || "lime"
      }))
    });
  }
}

export async function getDebts(userId: string) {
  return await prisma.financialDebt.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

export async function saveDebts(userId: string, debts: any[]) {
  await prisma.financialDebt.deleteMany({
    where: { userId }
  });
  
  if (debts.length > 0) {
    await prisma.financialDebt.createMany({
      data: debts.map(d => ({
        userId,
        name: d.name,
        type: d.type || "payable",
        amount: d.amount,
        dueDate: d.dueDate ? new Date(d.dueDate) : null,
        status: d.status || "unpaid",
        icon: d.icon || "utensils"
      }))
    });
  }
}

export async function getRiskProfile(userId: string) {
  return await prisma.riskProfile.findUnique({
    where: { userId }
  });
}

export async function saveRiskProfile(userId: string, profileData: any) {
  return await prisma.riskProfile.upsert({
    where: { userId },
    update: {
      profile: profileData.profile,
      answers: profileData.answers || "[]",
      aiRecommendation: profileData.aiRecommendation || "{}"
    },
    create: {
      userId,
      profile: profileData.profile,
      answers: profileData.answers || "[]",
      aiRecommendation: profileData.aiRecommendation || "{}"
    }
  });
}
