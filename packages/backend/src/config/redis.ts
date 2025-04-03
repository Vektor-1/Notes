import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

// Event listener for Redis client errors
redisClient.on('error', (err) => console.error('❌ Redis Client Error', err));

// Connect Redis function
export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (error) {
    console.error('❌ Redis connection error:', error);
    process.exit(1);
  }
}

export default redisClient;
