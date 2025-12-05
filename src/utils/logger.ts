import pino from "pino";
import { appConfig } from "@/config/env";

const logger = pino({
  level: appConfig.isProd ? "info" : "debug",
  transport: appConfig.isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      },
});

export {
  logger,
};
