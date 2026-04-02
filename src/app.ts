import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorMiddleware } from "./middleware/error.middleware";
import { adminRouter } from "./modules/admin/admin.routes";
import authRouter from "./modules/auth/auth.routes";
import { taskRouter } from "./modules/tasks/task.routes";

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/admin", adminRouter);

app.use(errorMiddleware);

export { app };
export default app;