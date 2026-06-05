"use server";

import prisma from "@/lib/prisma";

export async function getBadges() {
  return await prisma.gamificationBadge.findMany({
    orderBy: { createdAt: 'asc' }
  });
}

export async function createBadge(data: any) {
  console.log("createBadge called with:", data);
  const result = await prisma.gamificationBadge.create({
    data: {
      id: data.id,
      name: data.name,
      desc: data.desc,
      icon: data.icon,
      color: data.color || "lime",
      requirementType: data.requirementType,
      requirementValue: data.requirementValue,
      xp: data.xp || 100
    } as any
  });
  console.log("createBadge result:", result);
  return result;
}

export async function updateBadge(id: string, data: any) {
  console.log("updateBadge called with:", id, data);
  const result = await prisma.gamificationBadge.update({
    where: { id },
    data: {
      name: data.name,
      desc: data.desc,
      icon: data.icon,
      color: data.color || "lime",
      requirementType: data.requirementType,
      requirementValue: data.requirementValue,
      xp: data.xp || 100
    } as any
  });
  console.log("updateBadge result:", result);
  return result;
}

export async function deleteBadge(id: string) {
  // First remove this badge from all user profiles that have it unlocked
  try {
    await prisma.$executeRawUnsafe(
      `UPDATE user_profiles SET unlocked_badges = array_remove(unlocked_badges, $1::text) WHERE unlocked_badges @> ARRAY[$1::text]`,
      id
    );
  } catch (e) {
    // user_profiles may not exist locally / via prisma - ignore silently
    console.warn("Could not clean up user badges:", e);
  }
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
