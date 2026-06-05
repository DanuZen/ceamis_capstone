"use server";

import prisma from "@/lib/prisma";

export async function getTotalUsers() {
  try {
    // In our pulled schema, we have users in auth schema and user_profiles in public schema.
    // If Prisma doesn't map auth.users well, we can count user_profiles, or use raw query.
    const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM "auth"."users"`;
    // queryRaw returns array of objects, the count is usually BigInt
    if (result && Array.isArray(result) && result.length > 0) {
      return Number(result[0].count);
    }
    return 0;
  } catch (error) {
    console.error("Failed to count users", error);
    return 0;
  }
}
