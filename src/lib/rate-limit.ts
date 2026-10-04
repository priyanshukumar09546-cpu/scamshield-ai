/**
 * In-Memory Token Bucket Rate Limiter
 * Protects analysis endpoints, file uploads, and reporting from automated scraping and abuse
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const clientLimitMap = new Map<string, RateLimitRecord>();

export interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
}

export function checkRateLimit(
  clientId: string,
  options: RateLimitOptions = { windowMs: 60 * 1000, maxRequests: 30 }
): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = clientLimitMap.get(clientId);

  if (!record || now > record.resetAt) {
    clientLimitMap.set(clientId, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return { allowed: true, remaining: options.maxRequests - 1 };
  }

  if (record.count >= options.maxRequests) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  return { allowed: true, remaining: options.maxRequests - record.count };
}
