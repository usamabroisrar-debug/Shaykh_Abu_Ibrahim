import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

function toCents(amount: { toNumber(): number } | number) {
  const numericAmount = typeof amount === "number" ? amount : amount.toNumber();
  return Math.max(100, Math.round(numericAmount * 100));
}

function buildPaymentReference() {
  return `stripe-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function createStripeCheckoutForCourse(input: {
  userId: string;
  courseId: string;
}) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecret) {
    throw new Error("Stripe is not configured.");
  }

  const [user, course] = await Promise.all([
    prisma.user.findUnique({
      where: { id: input.userId },
      select: { email: true, name: true },
    }),
    prisma.course.findUnique({
      where: { id: input.courseId },
      select: { id: true, title: true, price: true },
    }),
  ]);

  if (!user || !course?.price) {
    throw new Error("Payment target is not available.");
  }

  const payment = await prisma.payment.create({
    data: {
      userId: input.userId,
      courseId: course.id,
      amount: course.price,
      currency: "USD",
      provider: "stripe",
      referenceId: buildPaymentReference(),
      status: "PENDING",
    },
  });

  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${getAppUrl()}/student?success=payment-started`,
    cancel_url: `${getAppUrl()}/student?error=payment-cancelled`,
    customer_email: user.email,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(toCents(course.price)),
    "line_items[0][price_data][product_data][name]": course.title,
    "metadata[paymentId]": payment.id,
    "metadata[courseId]": course.id,
    "metadata[userId]": input.userId,
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  if (!response.ok) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    throw new Error("Stripe checkout session could not be created.");
  }

  const checkout = (await response.json()) as {
    id?: string;
    url?: string;
  };

  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      providerSessionId: checkout.id || null,
      checkoutUrl: checkout.url || null,
      metadata: checkout,
    },
  });

  return {
    paymentId: payment.id,
    checkoutUrl: checkout.url,
  };
}

export function verifyStripeSignature(input: {
  payload: string;
  signatureHeader: string | null;
  secret: string;
}) {
  const header = input.signatureHeader || "";
  const timestamp = header.match(/t=([^,]+)/)?.[1];
  const signature = header.match(/v1=([^,]+)/)?.[1];

  if (!timestamp || !signature) {
    return false;
  }

  const expected = createHmac("sha256", input.secret)
    .update(`${timestamp}.${input.payload}`)
    .digest("hex");
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);

  return left.length === right.length && timingSafeEqual(left, right);
}

export async function handleStripeWebhookEvent(event: {
  id: string;
  type: string;
  data?: {
    object?: {
      id?: string;
      payment_status?: string;
      metadata?: Record<string, string>;
    };
  };
}) {
  await prisma.paymentWebhookEvent.upsert({
    where: { eventId: event.id },
    update: {
      payload: event,
      processedAt: new Date(),
    },
    create: {
      provider: "stripe",
      eventId: event.id,
      eventType: event.type,
      payload: event,
      processedAt: new Date(),
    },
  });

  const checkoutSession = event.data?.object;
  const paymentId = checkoutSession?.metadata?.paymentId;

  if (event.type === "checkout.session.completed" && paymentId) {
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: checkoutSession?.payment_status === "paid" ? "PAID" : "PENDING",
        providerSessionId: checkoutSession?.id || undefined,
        paidAt: checkoutSession?.payment_status === "paid" ? new Date() : null,
      },
    });
  }
}
