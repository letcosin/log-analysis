import { AppDataSource } from './config/database';
import { env } from './config/env';
import app from './app';

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    app.listen(env.port, () => {
      console.log(`API running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error('Error starting server', error);
    process.exit(1);
  }
}

bootstrap();
