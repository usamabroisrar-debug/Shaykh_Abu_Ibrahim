import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";

export async function createContactSubmission(input: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  userId?: string;
}) {
  return prisma.contactSubmission.create({
    data: input,
  });
}

export async function getRecentContactSubmissions(limit = 8) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}
