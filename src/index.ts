import express from "express";
import cors from "cors";
import helmet from "helmet";
import { appConfig } from "@/config/env";
import "@/config/database";
import "@/redis/redis.config";
import { logger } from "@/utils/logger";
import { authRouter } from "@/auth/auth.route";
import { doctorRouter } from "@/doctors/doctor.route";
import { hospitalRouter } from "@/hospitals/hospital.route";
import { specializationRouter } from "@/specializations/specialization.route";
import { jobRouter } from "@/jobs/job.route";
import { contactRouter } from "@/contact/contact.route";
import { notFoundHandler } from "@/middleware/notFoundHandler";
import { errorHandler } from "@/middleware/errorHandler";
import { responseHandler } from "@/middleware/responseHandler";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  logger.info({ method: req.method, url: req.url }, "Incoming request");
  next();
});

app.use(responseHandler);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/doctors", doctorRouter);
app.use("/api/hospitals", hospitalRouter);
app.use("/api/specializations", specializationRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/contact", contactRouter);

// Admin aliases (optional, but good for clarity if we wanted to separate them. 
// For now, the routers handle both public and admin paths internally)
app.use("/api/admin/doctors", doctorRouter);
app.use("/api/admin/hospitals", hospitalRouter);
app.use("/api/admin/specializations", specializationRouter);

import appointmentRouter from "./appointments/appointment.route";
import dashboardRouter from "./doctor-dashboard/dashboard.route";
import reviewRouter from "./reviews/review.route";

app.use("/api/appointments", appointmentRouter);
app.use("/api/doctor", dashboardRouter);
app.use("/api/reviews", reviewRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(appConfig.port, "0.0.0.0", () => {
  logger.info(`API server listening on port ${appConfig.port}`);
});

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
  server.close(() => process.exit(1));
});

