"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseLogLine = parseLogLine;
const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
function parseLogLine(line) {
    const trimmed = line.trim();
    if (!trimmed) {
        return null;
    }
    const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})\s(INFO|WARN|ERROR|DEBUG)\s(.+)$/);
    if (!match) {
        return null;
    }
    const [, datePart, timePart, level, message] = match;
    const timestamp = new Date(`${datePart}T${timePart}`);
    if (Number.isNaN(timestamp.getTime())) {
        return null;
    }
    if (!LEVELS.includes(level)) {
        return null;
    }
    return {
        timestamp,
        level: level,
        message: message.trim(),
        source: null,
    };
}
