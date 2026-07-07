import { hash } from "bcrypt";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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

    const email = parsed.data.email.toLowerCase();
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const password = await hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email,
        password,
        role: parsed.data.role,
        phone: parsed.data.phone,
        studentProfile:
          parsed.data.role === "STUDENT" || parsed.data.role === "PARENT"
            ? {
                create: {
                  phone: parsed.data.phone,
                  guardianName: parsed.data.guardianName,
                  guardianPhone: parsed.data.guardianPhone,
                  timezone: parsed.data.timezone,
                },
              }
            : undefined,
        teacherProfile:
          parsed.data.role === "TEACHER"
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

    return response.status(200).json({
      message: "Account created successfully.",
      user,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Registration could not be completed right now.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
