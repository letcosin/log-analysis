import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Log } from '../entities/Log';
import { env } from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.dbHost,
  port: env.dbPort,
  username: env.dbUsername,
  password: env.dbPassword,
  database: env.dbName,
  schema: env.dbSchema,
  synchronize: env.nodeEnv !== 'production',
  logging: env.nodeEnv === 'development',
  entities: [Log],
  migrations: [],
  subscribers: [],
});
