import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.connect();

const rateLimitKey = (ip: string) => `rate-limit:${ip}`;

const requests = new Map<string, { count: number; timestamp: number }>();

const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 100; // 100 requests per minute

export const checkRateLimit = (ip: string) => {
  const currentTime = Date.now();
  const requestData = requests.get(ip);

  if (requestData && currentTime - requestData.timestamp < RATE_LIMIT_WINDOW) {
    if (requestData.count >= RATE_LIMIT_MAX) {
      return false; // Rate limit exceeded
    }
    requestData.count += 1;
  } else {
    requests.set(ip, { count: 1, timestamp: currentTime });
  }

  return true;
};
