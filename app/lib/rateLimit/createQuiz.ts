import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 3;

setInterval(
  () => {
    const now = Date.now();
    for (const [ip, entry] of rateLimitMap.entries()) {
      if (entry.expiresAt <= now) rateLimitMap.delete(ip);
    }
  },
  5 * 60 * 1000,
);

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }

  if (entry.expiresAt <= now) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  rateLimitMap.set(ip, entry);
  return true;
}

export function rateLimitResponse(ip: string) {
  const allowed = checkRateLimit(ip);

  if (allowed) return null;

  const resetIn = Math.ceil(
    ((rateLimitMap.get(ip)?.expiresAt || Date.now()) - Date.now()) / 1000,
  );

  return NextResponse.json(
    {
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: `Too many requests. Try again in ${resetIn}s.`,
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": resetIn.toString(),
      },
    },
  );
}
