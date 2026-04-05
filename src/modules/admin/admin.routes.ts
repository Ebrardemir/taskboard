import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";
import { roleMiddleware } from "../../middleware/role.middleware";
import { adminController } from "./admin.controller";

const adminRouter = Router();

adminRouter.use(authMiddleware, roleMiddleware("admin"));
adminRouter.get("/dashboard", adminController.dashboard);
adminRouter.get("/users", adminController.listUsers);
adminRouter.get("/tasks", adminController.listAllTasks);

export { adminRouter };