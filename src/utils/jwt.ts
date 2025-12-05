import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { appConfig } from "@/config/env";

export interface TokenPayload {
  sub: string;
  role: string;
}

const signToken = (payload: TokenPayload, secret: Secret, expiresIn: string) =>
  jwt.sign(payload, secret, { expiresIn } as SignOptions);

const signAccessToken = (payload: TokenPayload) =>
  signToken(payload, appConfig.jwt.accessSecret, appConfig.jwt.accessTtl);

const signRefreshToken = (payload: TokenPayload) =>
  signToken(payload, appConfig.jwt.refreshSecret, appConfig.jwt.refreshTtl);

const verifyAccessToken = (token: string) =>
  jwt.verify(token, appConfig.jwt.accessSecret) as TokenPayload;

const verifyRefreshToken = (token: string) =>
  jwt.verify(token, appConfig.jwt.refreshSecret) as TokenPayload;

const signResetToken = (payload: { sub: string }) =>
  jwt.sign(payload, appConfig.jwt.accessSecret, { expiresIn: "1h" });

const verifyResetToken = (token: string) =>
  jwt.verify(token, appConfig.jwt.accessSecret) as { sub: string };

export {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  signResetToken,
  verifyResetToken,
};
