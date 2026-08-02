"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    port: Number(process.env.PORT ?? 3001),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    dbHost: process.env.DB_HOST ?? 'localhost',
    dbPort: Number(process.env.DB_PORT ?? 5432),
    dbUsername: process.env.DB_USERNAME ?? 'postgres',
    dbPassword: process.env.DB_PASSWORD ?? 'postgres',
    dbName: process.env.DB_NAME ?? 'logdb',
    dbSchema: process.env.DB_SCHEMA ?? 'public',
};
