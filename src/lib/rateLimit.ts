/**
 * 基于 IP 地址的内存限流
 * 使用 Map 存储请求记录，自动清理过期记录
 */

type RateLimitRecord = {
  count: number;
  resetTime: number;
};

const store = new Map<string, RateLimitRecord>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5分钟清理一次

/**
 * 限流检查
 * @param identifier 唯一标识符（如 `login:${ip}`）
 * @param limit 时间窗口内允许的最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @returns { success: boolean, remaining: number }
 */
export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();

  // 定期清理过期记录
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, record] of store) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
    lastCleanup = now;
  }

  const existing = store.get(identifier);

  if (!existing || now > existing.resetTime) {
    // 新窗口或窗口已过期
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0 };
  }

  existing.count++;
  return { success: true, remaining: limit - existing.count };
}
