import crypto from "node:crypto";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

function getNormalizedEnvValue(value: string | undefined, fallback: string) {
  const resolved = (value || fallback).trim();

  return resolved.replace(/^['"]|['"]$/g, "").trim();
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  });
}

export async function ensureSuperAdminUser() {
  const email = getNormalizedEnvValue(
    process.env.SUPER_ADMIN_EMAIL,
    "admin@shaykhabuibrahim.com"
  ).toLowerCase();
  const password = getNormalizedEnvValue(
    process.env.SUPER_ADMIN_PASSWORD,
    "Admin@123456"
  );
  const name = getNormalizedEnvValue(process.env.SUPER_ADMIN_NAME, "Super Admin");

  const hashedPassword = await hash(password, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      name,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
    create: {
      name,
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
    include: {
      studentProfile: true,
      teacherProfile: true,
    },
  });
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "PARENT" | "TEACHER";
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
  timezone?: string;
}) {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const password = await hash(input.password, 10);

  return prisma.user.create({
    data: {
      name,
      email,
      password,
      role: input.role,
      phone: input.phone?.trim() || null,
      studentProfile:
        input.role === "STUDENT" || input.role === "PARENT"
          ? {
              create: {
                phone: input.phone?.trim() || null,
                guardianName: input.guardianName?.trim() || null,
                guardianPhone: input.guardianPhone?.trim() || null,
                timezone: input.timezone?.trim() || "Asia/Karachi",
              },
            }
          : undefined,
      teacherProfile:
        input.role === "TEACHER"
          ? {
              create: {
                bio: `${name} is registered as a Shaykh Abu Ibrahim academy teacher.`,
                expertise: "Islamic Studies",
                headline: "Academy Teacher",
              },
            }
          : undefined,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
}

export async function createPasswordResetToken(email: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return null;
  }

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return token;
}

export async function resetUserPassword(token: string, password: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    resetToken.expiresAt.getTime() < Date.now()
  ) {
    throw new Error("INVALID_RESET_TOKEN");
  }

  const hashedPassword = await hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);
}
