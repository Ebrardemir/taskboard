import app from "./app";
import { env } from "./config/env";
import { initializeDatabase } from "./db/init";

const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

void startServer();