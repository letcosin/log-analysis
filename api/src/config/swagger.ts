import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
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
