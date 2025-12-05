import Redis from "ioredis";
import { appConfig } from "./env";
import { logger } from "@/utils/logger";

export const createRedisClient = () => {
  const client = new Redis(appConfig.redisUrl, {
    lazyConnect: false,
  });

  client.on("error", (error) => logger.error({ error }, "Redis error"));
  client.on("connect", () => logger.info("Connected to Redis"));

  return client;
};

