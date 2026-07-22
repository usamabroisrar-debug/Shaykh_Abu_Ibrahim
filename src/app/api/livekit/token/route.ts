import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createLiveKitAccessToken } from "@/lib/livekit";
import {
  authorizeLiveClassJoin,
  markLiveClassAttendance,
  updateLiveClassSession,
} from "@/services/live-class/live-class.service";

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
    const canManageRoom = ["SUPER_ADMIN", "ADMIN", "EDITOR", "TEACHER"].includes(
      session.user.role
    );
    const token = createLiveKitAccessToken({
      identity: session.user.id,
      name: session.user.name || session.user.email || "Learner",
      roomName: liveClass.roomName,
      canPublish: true,
      canPublishData: true,
      canSubscribe: true,
    });

    if (["STUDENT", "PARENT"].includes(session.user.role)) {
      await markLiveClassAttendance({
        liveClassSessionId: liveClass.id,
        studentId: session.user.id,
      }).catch(() => null);
    }

    if (canManageRoom && liveClass.status === "SCHEDULED") {
      await updateLiveClassSession({
        sessionId: liveClass.id,
        status: "LIVE",
      }).catch(() => null);
    }

    return NextResponse.json({
      token,
      roomName: liveClass.roomName,
      livekitUrl: process.env.NEXT_PUBLIC_LIVEKIT_URL || "",
      classTitle: liveClass.title,
      courseTitle: liveClass.course.title,
      lessonTitle: liveClass.lesson?.title || null,
      startsAt: liveClass.startsAt,
      durationMinutes: liveClass.durationMinutes,
      status: liveClass.status,
      role: session.user.role,
    });
  } catch {
    return NextResponse.json(
      { message: "Live class service is not configured yet." },
      { status: 503 }
    );
  }
}
