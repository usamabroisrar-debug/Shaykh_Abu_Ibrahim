import crypto from "node:crypto";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

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
  const email = input.email.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const password = await hash(input.password, 10);

  return prisma.user.create({
    data: {
      name: input.name,
      email,
      password,
      role: input.role,
      phone: input.phone,
      studentProfile:
        input.role === "STUDENT" || input.role === "PARENT"
          ? {
              create: {
                phone: input.phone,
                guardianName: input.guardianName,
                guardianPhone: input.guardianPhone,
                timezone: input.timezone,
              },
            }
          : undefined,
      teacherProfile:
        input.role === "TEACHER"
          ? {
              create: {
                expertise: "Islamic Studies",
              },
            }
          : undefined,
    },
    select: {
      id: true,
      email: true,
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
