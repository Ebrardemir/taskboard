import { Router } from "express";

import { authMiddleware } from "../../middleware/auth.middleware";
import { taskController } from "./task.controller";

const taskRouter = Router();

taskRouter.use(authMiddleware);
taskRouter.get("/", taskController.list);
taskRouter.get("/:id", taskController.getSingle);
taskRouter.post("/", taskController.create);
taskRouter.patch("/:id", taskController.update);
taskRouter.delete("/:id", taskController.remove);

export { taskRouter };
