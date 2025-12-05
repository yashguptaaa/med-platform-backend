import type { User } from "@prisma/client";
import type { UserDto } from "./auth.dto";
import { signAccessToken, signRefreshToken } from "@/utils/jwt";

const serializeUser = (user: User): UserDto => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  image: user.image,
  createdAt: user.created_at,
});

const buildTokens = (user: User) => {
  const payload = { sub: user.id, role: user.role };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export {
  serializeUser,
  buildTokens,
};
