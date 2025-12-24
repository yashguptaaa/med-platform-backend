import Redis from "ioredis";
import { appConfig } from "./env";
import { logger } from "@/utils/logger";

export const createRedisClient = () => {
  let client: Redis;

  if (appConfig.redisUrl) {
    client = new Redis(appConfig.redisUrl, {
      lazyConnect: false,
    });
  } else if (appConfig.redisHost && appConfig.redisPort) {
    client = new Redis({
      host: appConfig.redisHost,
      port: appConfig.redisPort,
      lazyConnect: false,
    });
  } else {
    // Fallback or error if neither is provided. 
    // Given the previous setup, we default to something or throw. 
    // But for dev safety let's assume if nothing is there, it might fail or use defaults.
    // ioredis defaults to localhost:6379 if empty, but we want to be explicit.
    logger.warn("No REDIS_URL or REDIS_HOST/PORT provided. Defaulting to localhost:6379");
    client = new Redis({
      host: "localhost",
      port: 6379,
      lazyConnect: false,
    });
  }

  client.on("error", (error) => logger.error({ error }, "Redis error"));
  client.on("connect", () => logger.info("Connected to Redis"));

  return client;
};

