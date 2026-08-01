interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitResult {
  allowed: boolean;
  headers: Record<string, string>;
}

const buckets = new Map<string, RateLimitEntry>();

function clientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || request.headers.get("x-real-ip") || "local";
}

export function checkRateLimit(
  request: Request,
  namespace: string,
  limit = 60,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  const key = `${namespace}:${clientIdentifier(request)}`;
  const current = buckets.get(key);
  const entry = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;

  entry.count += 1;
  buckets.set(key, entry);

  if (buckets.size > 1_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) {
        buckets.delete(bucketKey);
      }
    }
  }

  return {
    allowed: entry.count <= limit,
    headers: {
      "RateLimit-Limit": String(limit),
      "RateLimit-Remaining": String(Math.max(limit - entry.count, 0)),
      "RateLimit-Reset": String(Math.ceil(entry.resetAt / 1_000))
    }
  };
}
