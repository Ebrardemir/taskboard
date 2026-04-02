export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "super-secret-dev-key",
  dbPath: process.env.DB_PATH || "src/db/database.sqlite",
};