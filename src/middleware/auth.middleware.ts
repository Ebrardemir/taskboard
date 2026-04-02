import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { findRevokedTokenByHash } from "../repositories/revoked-token.repository";
import { AppError } from "../utils/app-error";
import { hashToken } from "../utils/token-hash";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const decoded = verifyToken(token);
    const tokenHash = hashToken(token);
    const revokedToken = await findRevokedTokenByHash(tokenHash);

    if (revokedToken) {
      return next(new AppError("Unauthorized", 401));
    }

    req.user = decoded;
    return next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return next(new AppError("Unauthorized", 401));
    }

    return next(error as Error);
  }
};