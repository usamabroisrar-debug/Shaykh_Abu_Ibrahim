import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { createAdmission } from "@/services/admission/admission.service";
import { createStripeCheckoutForCourse } from "@/services/payment/payment-gateway.service";

const admissionSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  timezone: z.string().min(2),
  ageGroup: z.string().min(2),
  course: z.string().min(2),
  message: z.string().max(700).optional(),
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
    const parsed = admissionSchema.safeParse(request.body);

    if (!parsed.success) {
      return response.status(400).json({
        message: "Please complete all required admission fields.",
        errors: parsed.error.flatten(),
      });
    }

    const { admission, course } = await createAdmission({
      ...parsed.data,
      userId: session?.user?.id,
    });

    let checkoutUrl: string | undefined;

    if (session?.user?.id && course?.id && course.price) {
      try {
        const checkout = await createStripeCheckoutForCourse({
          userId: session.user.id,
          courseId: course.id,
        });
        checkoutUrl = checkout.checkoutUrl;
      } catch {
        // Payment is optional at this step; admission still succeeds without it.
      }
    }

    return response.status(200).json({
      message: "Admission request submitted successfully.",
      admissionId: admission.id,
      checkoutUrl,
    });
  } catch (error) {
    return response.status(500).json({
      message: "Admission request could not be submitted.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
