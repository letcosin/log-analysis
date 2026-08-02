"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
exports.swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Log Analysis API',
            version: '1.0.0',
            description: 'API para importação, consulta e análise de registros de logs.',
        },
        servers: [{ url: 'http://localhost:3001/api' }],
    },
    apis: ['./src/routes/*.ts'],
});
