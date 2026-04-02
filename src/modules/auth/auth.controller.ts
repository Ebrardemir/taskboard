import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import {
  addRevokedToken,
  findRevokedTokenByHash,
} from "../../repositories/revoked-token.repository";
import { AppError } from "../../utils/app-error";
import { hashToken } from "../../utils/token-hash";
import { verifyToken } from "../../utils/jwt";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, registerUser } from "./auth.service";

export const registerController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const user = await registerUser(validatedData);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    return next(error);
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await loginUser(validatedData);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError("Unauthorized", 401);
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      throw new AppError("Unauthorized", 401);
    }

    try {
      verifyToken(token);
    } catch (error) {
      if (
        error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError
      ) {
        throw new AppError("Unauthorized", 401);
      }

      throw error;
    }

    const tokenHash = hashToken(token);
    const revokedToken = await findRevokedTokenByHash(tokenHash);

    if (revokedToken) {
      throw new AppError("Unauthorized", 401);
    }

    await addRevokedToken(tokenHash);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
};