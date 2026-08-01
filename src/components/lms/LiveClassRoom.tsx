"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import styles from "./LiveClassRoom.module.css";

type LiveClassTokenPayload = {
  token?: string;
  roomName?: string;
  livekitUrl?: string;
  classTitle?: string;
  courseTitle?: string;
  lessonTitle?: string | null;
  startsAt?: string;
  durationMinutes?: number;
  message?: string;
};

export function LiveClassRoom({
  sessionId,
  fallbackTitle,
  fallbackCourse,
}: {
  sessionId: string;
  fallbackTitle: string;
  fallbackCourse: string;
}) {
  const router = useRouter();
  const [payload, setPayload] = useState<LiveClassTokenPayload | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadToken() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/livekit/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });
        const data = (await response.json().catch(() => ({}))) as LiveClassTokenPayload;

        if (!isActive) {
          return;
        }

        if (!response.ok || !data.token || !data.livekitUrl) {
          setError(data.message || "Live classroom is not available right now.");
          setPayload(data);
          return;
        }

        setPayload(data);
      } catch {
        if (isActive) {
          setError("Live classroom could not be prepared. Please try again.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    loadToken();

    return () => {
      isActive = false;
    };
  }, [sessionId]);

  const title = payload?.classTitle || fallbackTitle;
  const courseTitle = payload?.courseTitle || fallbackCourse;

  if (isLoading) {
    return (
      <section className={styles.statePanel}>
        <span className={styles.loader} aria-hidden="true" />
        <h1>Preparing live classroom</h1>
        <p>We are checking your access and creating a secure classroom token.</p>
      </section>
    );
  }

  if (error || !payload?.token || !payload.livekitUrl) {
    return (
      <section className={styles.statePanel}>
        <h1>Live classroom is not ready</h1>
        <p>{error || "Ask admin to configure LiveKit environment variables."}</p>
        <button type="button" onClick={() => router.back()}>
          Go back
        </button>
      </section>
    );
  }

  return (
    <main className={styles.classroomShell}>
      <header className={styles.classroomHeader}>
        <div>
          <span>Secure Live Class</span>
          <h1>{title}</h1>
          <p>
            {courseTitle}
            {payload.lessonTitle ? ` | ${payload.lessonTitle}` : ""}
          </p>
        </div>
        <button type="button" onClick={() => router.push("/student")}>
          Leave classroom
        </button>
      </header>

      <LiveKitRoom
        serverUrl={payload.livekitUrl}
        token={payload.token}
        connect
        video
        audio
        className={styles.livekitRoom}
        onDisconnected={() => router.back()}
      >
        <VideoConference />
      </LiveKitRoom>
    </main>
  );
}
