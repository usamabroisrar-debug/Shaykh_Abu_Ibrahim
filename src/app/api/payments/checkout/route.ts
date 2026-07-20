import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createStripeCheckoutForCourse } from "@/services/payment/payment-gateway.service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id || !["STUDENT", "PARENT"].includes(session.user.role)) {
    return NextResponse.json({ message: "Student login required." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const courseId = String(body.courseId || "").trim();

  if (!courseId) {
    return NextResponse.json({ message: "Course is required." }, { status: 400 });
  }

  try {
    const checkout = await createStripeCheckoutForCourse({
      userId: session.user.id,
      courseId,
    });

    return NextResponse.json(checkout);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Checkout could not be started.",
      },
      { status: 503 }
    );
  }
}
