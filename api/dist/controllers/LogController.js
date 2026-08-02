"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = void 0;
const LogImportService_1 = require("../services/LogImportService");
const LogQueryService_1 = require("../services/LogQueryService");
class LogController {
    importService;
    queryService;
    constructor(importService = new LogImportService_1.LogImportService(), queryService = new LogQueryService_1.LogQueryService()) {
        this.importService = importService;
        this.queryService = queryService;
    }
    import = async (req, res, next) => {
        try {
            const file = req.file;
            if (!file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }
            const content = file.buffer.toString('utf-8');
            const result = await this.importService.importFromText(content);
            return res.status(200).json({
                message: 'Log import completed',
                ...result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    list = async (req, res, next) => {
        try {
            const { level, search, page, limit } = req.query;
            const data = await this.queryService.list({
                level: level,
                search: search ? String(search) : undefined,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 20,
            });
            return res.json(data);
        }
        catch (error) {
            next(error);
        }
    };
    stats = async (_req, res, next) => {
        try {
            const data = await this.queryService.stats();
            return res.json(data);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LogController = LogController;
