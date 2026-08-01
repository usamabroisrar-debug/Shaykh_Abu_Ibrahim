import { redirect } from "next/navigation";
import { LiveClassRoom } from "@/components/lms/LiveClassRoom";
import { auth, getDashboardPath } from "@/lib/auth";
import { authorizeLiveClassJoin } from "@/services/live-class/live-class.service";

export const metadata = {
  title: "Live Classroom",
};

export default async function LiveClassPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const session = await auth();
  const { sessionId } = await params;

  if (!session?.user?.id) {
    redirect(`/login?next=/live-class/${sessionId}`);
  }

  const liveClass = await authorizeLiveClassJoin({
    sessionId,
    userId: session.user.id,
    role: session.user.role,
  });

  if (!liveClass) {
    redirect(getDashboardPath(session.user.role));
  }

  return (
    <LiveClassRoom
      sessionId={liveClass.id}
      fallbackTitle={liveClass.title}
      fallbackCourse={liveClass.course.title}
    />
  );
}
