import { createUser, findUserByEmail } from "../../repositories/user.repository";
import type {
  LoginInput,
  LoginResult,
  RegisterInput,
  SafeUser,
  User,
} from "../../types/auth.types";
import { comparePassword, hashPassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { AppError } from "../../utils/app-error";

const toSafeUser = (user: User): SafeUser => {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
};

export const registerUser = async (input: RegisterInput): Promise<SafeUser> => {
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedUsername = input.username.trim();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  const passwordHash = await hashPassword(input.password);

  const createdUser = await createUser(
    normalizedUsername,
    normalizedEmail,
    passwordHash,
    "user",
  );

  return toSafeUser(createdUser);
};

export const loginUser = async (input: LoginInput): Promise<LoginResult> => {
  const normalizedEmail = input.email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const isPasswordCorrect = await comparePassword(
    input.password,
    user.password_hash,
  );

  if (!isPasswordCorrect) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = generateToken({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: toSafeUser(user),
  };
};