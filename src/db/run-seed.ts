import { initializeDatabase } from "./init";
import { seedDatabase } from "./seed";

const runSeed = async () => {
  try {
    await initializeDatabase();
    await seedDatabase();
    console.log("Seed command completed.");
    process.exit(0);
  } catch (error) {
    console.error("Seed command failed:", error);
    process.exit(1);
  }
};

void runSeed();