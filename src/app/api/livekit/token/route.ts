import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createLiveKitAccessToken } from "@/lib/livekit";
import { authorizeLiveClassJoin } from "@/services/live-class/live-class.service";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login required." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const sessionId = String(body.sessionId || "").trim();

  if (!sessionId) {
    return NextResponse.json({ message: "Live class session is required." }, { status: 400 });
  }

  const liveClass = await authorizeLiveClassJoin({
    sessionId,
    userId: session.user.id,
    role: session.user.role,
  });

  if (!liveClass) {
    return NextResponse.json({ message: "You are not allowed to join this class." }, { status: 403 });
  }

  try {
    const token = createLiveKitAccessToken({
      identity: session.user.id,
      name: session.user.name || session.user.email || "Learner",
      roomName: liveClass.roomName,
    });

    return NextResponse.json({
      token,
      roomName: liveClass.roomName,
      livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
    });
  } catch {
    return NextResponse.json(
      { message: "Live class service is not configured yet." },
      { status: 503 }
    );
  }
}
