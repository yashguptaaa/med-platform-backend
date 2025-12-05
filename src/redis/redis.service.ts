import { redisClient } from "./redis.config";
import { logger } from "@/utils/logger";

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await redisClient.get(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    logger.warn({ error }, "Redis get error");
    return null;
  }
};

export const setCache = async (key: string, value: unknown, ttlSeconds: number) => {
  try {
    await redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (error) {
    logger.warn({ error }, "Redis set error");
  }
};

