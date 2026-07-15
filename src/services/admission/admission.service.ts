import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/server";

export async function createAdmission(input: {
  name: string;
  email: string;
  phone: string;
  guardianName?: string;
  guardianPhone?: string;
  timezone: string;
  ageGroup: string;
  course: string;
  message?: string;
  userId?: string;
}) {
  const admission = await prisma.admission.create({
    data: input,
  });

  if (input.userId) {
    await prisma.notification.create({
      data: {
        userId: input.userId,
        title: "Admission submitted",
        message:
          "Your admission request is now in review. We will guide you on the next steps shortly.",
        type: "ADMISSION",
      },
    });
  }

  return admission;
}

export async function getRecentAdmissions(limit = 8) {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.admission.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}
