import redisClient from "../../src/config/redis"; // Adjust path accordingly

describe("Redis functionality", () => {
  test("should store and retrieve data from Redis", async () => {
    await redisClient.set("key", "value");
    const value = await redisClient.get("key");
    expect(value).toBe("value");
  });

  beforeAll(async () => {
    await redisClient.connect();
  });
  
  afterAll(async () => {
    await redisClient.quit();
  });  
});
