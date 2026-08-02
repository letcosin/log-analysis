"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogQueryService = void 0;
const LogRepository_1 = require("../repositories/LogRepository");
class LogQueryService {
    logRepository;
    constructor(logRepository = new LogRepository_1.LogRepository()) {
        this.logRepository = logRepository;
    }
    async list(filters = {}) {
        return this.logRepository.findAll(filters);
    }
    async stats() {
        return this.logRepository.getStats();
    }
}
exports.LogQueryService = LogQueryService;
