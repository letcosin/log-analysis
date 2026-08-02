import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import logsRoutes from './routes/logs.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFound';
import { swaggerSpec } from './config/swagger';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/logs', logsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
