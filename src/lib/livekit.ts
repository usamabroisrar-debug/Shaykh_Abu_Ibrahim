import { createHmac } from "node:crypto";

function base64Url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

export function createLiveKitAccessToken(input: {
  identity: string;
  name: string;
  roomName: string;
  ttlSeconds?: number;
  canPublish?: boolean;
  canPublishData?: boolean;
  canSubscribe?: boolean;
}) {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit environment variables are not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const payload = {
    iss: apiKey,
    sub: input.identity,
    name: input.name,
    nbf: now - 10,
    exp: now + (input.ttlSeconds || 60 * 60 * 2),
    video: {
      roomJoin: true,
      room: input.roomName,
      canPublish: input.canPublish ?? true,
      canPublishData: input.canPublishData ?? true,
      canSubscribe: input.canSubscribe ?? true,
    },
  };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const body = `${encodedHeader}.${encodedPayload}`;
  const signature = createHmac("sha256", apiSecret).update(body).digest("base64url");

  return `${body}.${signature}`;
}
