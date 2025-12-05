import { PrismaClient } from "@prisma/client";
import { appConfig } from "./env";
import { logger } from "@/utils/logger";

export const prisma = new PrismaClient({
  log: appConfig.isProd ? ["error"] : ["query", "error", "warn"],
});

prisma
  .$connect()
  .then(() => logger.info("Connected to PostgreSQL"))
  .catch((error: any) => {
    logger.error({ error }, "Failed to connect to PostgreSQL");
    process.exit(1);
  });
