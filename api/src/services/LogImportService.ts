import { AppDataSource } from '../config/database';
import { Log } from '../entities/Log';
import { parseLogLine } from '../utils/parseLogLine';

export type ImportResult = {
  total: number;
  imported: number;
  ignored: number;
  durationMs: number;
};

export class LogImportService {
  async importFromText(content: string): Promise<ImportResult> {
    const startedAt = Date.now();
    const lines = content.split(/\r?\n/);
    const validLogs: Partial<Log>[] = [];

    let imported = 0;
    let ignored = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed) {
        continue;
      }

      const parsed = parseLogLine(line);

      if (!parsed) {
        ignored += 1;
        continue;
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
      await AppDataSource.getRepository(Log).save(validLogs as Log[]);
    }

    return {
      total: imported + ignored,
      imported,
      ignored,
      durationMs: Date.now() - startedAt,
    };
  }
}
