import { Router } from "express";
import * as authController from "./auth.controller";
import { validateRequest } from "@/middleware/validateRequest";
import {
  loginSchema,
  refreshSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.validator";

export const authRouter = Router();

import { upload } from "@/utils/upload";
authRouter.post("/register", upload.single("image"), validateRequest(registerSchema), authController.register);
authRouter.post("/login", validateRequest(loginSchema), authController.login);
authRouter.post("/refresh", validateRequest(refreshSchema), authController.refresh);
authRouter.post("/forgot-password", validateRequest(forgotPasswordSchema), authController.forgotPassword);
authRouter.post("/reset-password", validateRequest(resetPasswordSchema), authController.resetPassword);
