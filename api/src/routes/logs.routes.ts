import { Router } from 'express';
import { LogController } from '../controllers/LogController';
import { upload } from '../config/multer';

const router = Router();
const controller = new LogController();

/**
 * @swagger
 * /logs/import:
 *   post:
 *     summary: Importa arquivo de logs
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Importação concluída
 */
router.post('/import', upload.single('file'), controller.import);

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Lista logs com filtros opcionais
 *     parameters:
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [INFO, WARN, ERROR, DEBUG]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Lista paginada de logs
 */
router.get('/', controller.list);

/**
 * @swagger
 * /logs/stats:
 *   get:
 *     summary: Retorna estatísticas dos logs
 *     responses:
 *       200:
 *         description: Estatísticas por nível e por hora
 */
router.get('/stats', controller.stats);

export default router;
