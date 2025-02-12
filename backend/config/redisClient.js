// import Redis from "ioredis";
const Redis = require("ioredis");
if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error("❌ Missing UPSTASH_REDIS_REST_URL in environment variables");
}
const redis = new Redis(process.env.UPSTASH_REDIS_REST_URL); // Load from env variables
// console.log(redis);
redis.on("connect", () => console.log("✅ Connected to Upstash Redis!"));
redis.on("error", (err) => console.error("❌ Redis Connection Error:", err));

// Function to set a key-value pair in Redis
const setCache = async (key, value, expiry = 3600) => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", expiry); // Auto-expire
    console.log(`✅ Cached: ${key}`);
  } catch (error) {
    console.error("❌ Redis Set Error:", error);
  }
};

// Function to get a value from Redis
const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null; // Parse JSON if found
  } catch (error) {
    console.error("❌ Redis Get Error:", error);
    return null;
  }
};
// Using an async IIFE to await our async calls
// (async () => {
//   await setCache("go", "goa");
//   const value = await getCache("go");
//   console.log("Cached value:", value);
// })();

module.exports = { redis, setCache, getCache };
