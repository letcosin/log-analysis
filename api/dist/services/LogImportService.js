"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogImportService = void 0;
const database_1 = require("../config/database");
const Log_1 = require("../entities/Log");
const parseLogLine_1 = require("../utils/parseLogLine");
class LogImportService {
    async importFromText(content) {
        const lines = content.split(/\r?\n/);
        const validLogs = [];
        let imported = 0;
        let ignored = 0;
        for (const [index, line] of lines.entries()) {
            const trimmed = line.trim();
            if (!trimmed) {
                continue;
            }
            const parsed = (0, parseLogLine_1.parseLogLine)(line);
            if (!parsed) {
                throw new Error(`Formato de log inválido na linha ${index + 1}: "${line}"`);
            }
            validLogs.push({
                level: parsed.level,
                timestamp: parsed.timestamp,
                message: parsed.message,
                source: parsed.source ?? null,
                metadata: {},
            });
            imported += 1;
        }
        if (validLogs.length > 0) {
            await database_1.AppDataSource.getRepository(Log_1.Log).save(validLogs);
        }
        return {
            total: imported + ignored,
            imported,
            ignored,
        };
    }
}
exports.LogImportService = LogImportService;
