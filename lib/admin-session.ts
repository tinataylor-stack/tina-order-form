import type { NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE_NAME = "admin-session";
const ADMIN_SESSION_DURATION_SECONDS = 60 * 60 * 8;
const ADMIN_SESSION_DURATION_MS = ADMIN_SESSION_DURATION_SECONDS * 1000;

type AdminSessionPayload = {
  exp: number;
};

function getAdminSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PAGE_PASSWORD;

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET or ADMIN_PAGE_PASSWORD must be set in the environment"
    );
  }

  return secret;
}

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function signValue(value: string) {
  const secret = getAdminSessionSecret();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  return toHex(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))
  );
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let diff = 0;

  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return diff === 0;
}

export async function createAdminSessionToken() {
  const payload: AdminSessionPayload = {
    exp: Date.now() + ADMIN_SESSION_DURATION_MS,
  };

  const encodedPayload = encodeURIComponent(JSON.stringify(payload));
  const signature = await signValue(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const separatorIndex = token.lastIndexOf(".");

  if (separatorIndex <= 0) {
    return false;
  }

  const encodedPayload = token.slice(0, separatorIndex);
  const signature = token.slice(separatorIndex + 1);
  const expectedSignature = await signValue(encodedPayload);

  if (!safeEqual(signature, expectedSignature)) {
    return false;
  }

  try {
    const payload = JSON.parse(
      decodeURIComponent(encodedPayload)
    ) as AdminSessionPayload;

    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function hasValidAdminSession(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  return verifyAdminSessionToken(token);
}

export function getAdminSessionCookieOptions(expiresNow = false) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: expiresNow ? 0 : ADMIN_SESSION_DURATION_SECONDS,
  };
}

export { ADMIN_SESSION_COOKIE_NAME };
