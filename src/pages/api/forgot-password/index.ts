import crypto from "node:crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  try {
    const parsed = forgotPasswordSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });

    if (!user) {
      return response.status(200).json({
        message: "If an account exists for this email, a reset link is now ready.",
      });
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

    return response.status(200).json({
      message: "Reset link created successfully.",
      resetUrl: `/reset-password?token=${token}`,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Password reset could not be started.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
