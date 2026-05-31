"use server";

import prisma from "@/lib/prisma";

export async function getBadges() {
  return await prisma.gamificationBadge.findMany({
    orderBy: { createdAt: 'asc' }
  });
}

export async function createBadge(data: any) {
  return await prisma.gamificationBadge.create({
    data: {
      id: data.id,
      name: data.name,
      desc: data.desc,
      icon: data.icon,
      requirementType: data.requirementType,
      requirementValue: data.requirementValue,
      xp: data.xp || 100
    }
  });
}

export async function updateBadge(id: string, data: any) {
  return await prisma.gamificationBadge.update({
    where: { id },
    data: {
      name: data.name,
      desc: data.desc,
      icon: data.icon,
      requirementType: data.requirementType,
      requirementValue: data.requirementValue,
      xp: data.xp || 100
    }
  });
}

export async function deleteBadge(id: string) {
  return await prisma.gamificationBadge.delete({
    where: { id }
  });
}

export async function saveBadgesBulk(badges: any[]) {
  // Clear and rewrite all badges
  await prisma.gamificationBadge.deleteMany({});
  
  if (badges.length > 0) {
    await prisma.gamificationBadge.createMany({
      data: badges.map(b => ({
        id: b.id,
        name: b.name,
        desc: b.desc,
        icon: b.icon,
        requirementType: b.requirementType,
        requirementValue: b.requirementValue,
        xp: b.xp || 100
      }))
    });
  }
}
