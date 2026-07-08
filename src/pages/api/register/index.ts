import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { registerUser } from "@/services/auth/auth.service";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["STUDENT", "PARENT", "TEACHER"]).default("STUDENT"),
  phone: z.string().min(7).optional(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  timezone: z.string().optional(),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  try {
    const parsed = registerSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "Please provide valid registration details.",
        errors: parsed.error.flatten(),
      });
    }

    const user = await registerUser(parsed.data);

    return response.status(200).json({
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
      return response.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    return response.status(500).json({
      message: "Registration could not be completed right now.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
