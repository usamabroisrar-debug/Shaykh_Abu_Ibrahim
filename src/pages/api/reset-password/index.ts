import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { resetUserPassword } from "@/services/auth/auth.service";

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

    await resetUserPassword(parsed.data.token, parsed.data.password);

    return response.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "INVALID_RESET_TOKEN") {
      return response.status(400).json({
        message: "This reset token is invalid or has expired.",
      });
    }

    return response.status(500).json({
      message: "Password reset failed.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
