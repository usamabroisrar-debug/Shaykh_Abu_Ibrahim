import { hash } from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  try {
    const parsed = resetPasswordSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "Please provide a valid reset token and password.",
      });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: parsed.data.token },
    });

    if (
      !resetToken ||
      resetToken.usedAt ||
      resetToken.expiresAt.getTime() < Date.now()
    ) {
      return response.status(400).json({
        message: "This reset token is invalid or has expired.",
      });
    }

    const password = await hash(parsed.data.password, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: { password },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return response.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      message: "Password reset failed.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
