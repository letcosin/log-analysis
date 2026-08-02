import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3001),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbPort: Number(process.env.DB_PORT ?? 5432),
  dbUsername: process.env.DB_USERNAME ?? 'postgres',
  dbPassword: process.env.DB_PASSWORD ?? 'postgres',
  dbName: process.env.DB_NAME ?? 'logdb',
  dbSchema: process.env.DB_SCHEMA ?? 'public',
};
