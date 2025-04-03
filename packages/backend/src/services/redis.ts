import { createClient } from 'redis';

export const connectRedis = async () => {
  const client = createClient();
  client.on('error', (err) => console.error('Redis Client Error', err));

  await client.connect();
  console.log('Connected to Redis');
  return client;
};
