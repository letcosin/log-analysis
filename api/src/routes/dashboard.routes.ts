import { Router } from 'express';
import { LogController } from '../controllers/LogController';

const router = Router();
const controller = new LogController();

router.get('/trends', controller.trends);

export default router;
