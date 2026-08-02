"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const env_1 = require("./config/env");
const app_1 = __importDefault(require("./app"));
async function bootstrap() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('Database connected');
        app_1.default.listen(env_1.env.port, () => {
            console.log(`API running at http://localhost:${env_1.env.port}`);
        });
    }
    catch (error) {
        console.error('Error starting server', error);
        process.exit(1);
    }
}
bootstrap();
