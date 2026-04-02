export type UserRole = "admin" | "user";

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface SafeUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface JwtPayload {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginResult {
  token: string;
  user: SafeUser;
}