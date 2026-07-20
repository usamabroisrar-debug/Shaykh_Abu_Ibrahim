import { NextResponse } from "next/server";
import {
  handleStripeWebhookEvent,
  verifyStripeSignature,
} from "@/services/payment/payment-gateway.service";

export async function POST(request: Request) {
  const payload = await request.text();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ message: "Stripe webhook is not configured." }, { status: 503 });
  }

  const isValid = verifyStripeSignature({
    payload,
    signatureHeader: request.headers.get("stripe-signature"),
    secret: webhookSecret,
  });

  if (!isValid) {
    return NextResponse.json({ message: "Invalid webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(payload);

  await handleStripeWebhookEvent(event);

  return NextResponse.json({ received: true });
}
