"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Log_1 = require("../entities/Log");
const env_1 = require("./env");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: env_1.env.dbHost,
    port: env_1.env.dbPort,
    username: env_1.env.dbUsername,
    password: env_1.env.dbPassword,
    database: env_1.env.dbName,
    schema: env_1.env.dbSchema,
    synchronize: env_1.env.nodeEnv !== 'production',
    logging: env_1.env.nodeEnv === 'development',
    entities: [Log_1.Log],
    migrations: [],
    subscribers: [],
});
