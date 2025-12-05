import { prisma } from "@/config/database";
import { AppError } from "@/utils/appError";
import { StatusCodes } from "http-status-codes";
import { hashPassword, comparePassword } from "@/utils/password";
import { verifyRefreshToken } from "@/utils/jwt";
import type { AuthResponseDto, LoginDto, RefreshDto, RegisterDto } from "./auth.dto";
import { buildTokens, serializeUser } from "./auth.helper";
import { redisClient } from "@/redis/redis.config";
import { Resend } from "resend";
import { appConfig } from "@/config/env";
import { signResetToken, verifyResetToken } from "@/utils/jwt";

const resend = new Resend(appConfig.email.resendApiKey);

const register = async (payload: RegisterDto & { image?: string }): Promise<AuthResponseDto> => {
  const existing = await prisma.user.findUnique({ where: { email: payload.email } });
  if (existing) {
    throw new AppError("Email already registered", StatusCodes.CONFLICT);
  }

  const password_hash = await hashPassword(payload.password);
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: password_hash,
      image: payload.image,
    },
  });

  const tokens = buildTokens(user);
  return { user: serializeUser(user), ...tokens };
};

const login = async (payload: LoginDto): Promise<AuthResponseDto> => {
  const user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    throw new AppError("Invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const valid = await comparePassword(payload.password, user.password);
  if (!valid) {
    throw new AppError("Invalid credentials", 401);
  }

  const tokens = buildTokens(user);
  return { user: serializeUser(user), ...tokens };
};

const refresh = async (payload: RefreshDto): Promise<Omit<AuthResponseDto, "refreshToken">> => {
  const decoded = verifyRefreshToken(payload.refreshToken);
  const user = await prisma.user.findUnique({ where: { id: decoded.sub } });

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  const tokens = buildTokens(user);
  return { user: serializeUser(user), accessToken: tokens.accessToken };
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  console.log("user", user)
  if (!user) {
    return;
  }

  // Generate JWT with user ID
  const token = signResetToken({ sub: user.id });
  console.log("Token: ", token);

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;
  
  // FOR DEV ONLY: Log the link so we can test without sending real emails
  console.log("=================================================================");
  console.log("PASSWORD RESET LINK:", resetLink);
  console.log("=================================================================");
  
  try {
    await resend.emails.send({
      from: appConfig.email.from,
      to: email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
  } catch (error) {
    console.error("Failed to send reset email", error);
  }
};

const resetPassword = async (token: string, password: string) => {
  let userId: string;
  
  try {
    const decoded = verifyResetToken(token);
    userId = decoded.sub;
  } catch (error) {
    throw new AppError("Invalid or expired reset token", StatusCodes.BAD_REQUEST);
  }

  const password_hash = await hashPassword(password);
  await prisma.user.update({
    where: { id: userId },
    data: { password: password_hash },
  });
};

export {
  register,
  login,
  refresh,
  forgotPassword,
  resetPassword,
};
