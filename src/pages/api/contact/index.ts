import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createContactSubmission } from "@/services/contact/contact.service";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).optional(),
  message: z.string().min(10).max(1000),
});

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed." });
  }

  try {
    const session = await getServerSession(request, response, authOptions);
    const parsed = contactSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "Please complete the contact form properly.",
      });
    }

    const submission = await createContactSubmission({
      ...parsed.data,
      userId: session?.user?.id,
    });

    return response.status(200).json({
      message: "Your message has been saved successfully.",
      submissionId: submission.id,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Your message could not be sent right now.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
