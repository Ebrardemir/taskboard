import type { NextFunction, Request, Response } from "express";

import type { UserRole } from "../types/auth.types";
import { AppError } from "../utils/app-error";

export const roleMiddleware =
  (role: UserRole) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (req.user.role !== role) {
      return next(new AppError("Forbidden", 403));
    }

    return next();
  };