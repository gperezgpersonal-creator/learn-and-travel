
type RateLimitStore = Map<string, number[]>;

const rateLimitMap: RateLimitStore = new Map();

/**
 * Basic in-memory rate limiter.
 * @param ip Identifier (IP address)
 * @param limit Max requests
 * @param windowMs Time window in milliseconds
 * @returns true if allowed, false if rate limited
 */
export function rateLimit(ip: string, limit: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;

    const requests = rateLimitMap.get(ip) || [];

    // Filter out old requests
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= limit) {
        return false;
    }

    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    // Cleanup old entries periodically could be added, but for now this map grows slowly
    // A smarter implementation would use a different structure, but this is sufficient for basic protection.

    return true;
}
