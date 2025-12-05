import { UserRole } from "@prisma/client";

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
  createdAt: Date;
}

export interface AuthResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

