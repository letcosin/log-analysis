"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LogController_1 = require("../controllers/LogController");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
const controller = new LogController_1.LogController();
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
router.post('/import', multer_1.upload.single('file'), controller.import);
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
exports.default = router;
