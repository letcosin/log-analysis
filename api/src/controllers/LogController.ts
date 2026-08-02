import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/httpError';
import { LogImportService } from '../services/LogImportService';
import { LogQueryService } from '../services/LogQueryService';

export class LogController {
  constructor(
    private readonly importService = new LogImportService(),
    private readonly queryService = new LogQueryService(),
  ) {}

  private parseDateFilter(value: unknown, name: 'startDate' | 'endDate'): Date | undefined {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }

    const date = new Date(String(value));

    if (Number.isNaN(date.getTime())) {
      throw new HttpError(400, `Data inválida para ${name}`);
    }

    if (name === 'startDate') {
      date.setHours(0, 0, 0, 0);
    } else {
      date.setHours(23, 59, 59, 999);
    }

    return date;
  }

  import = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;

      if (!file) {
        throw new HttpError(400, 'Arquivo de importação inválido');
      }

      const content = file.buffer.toString('utf-8');
      const result = await this.importService.importFromText(content);

      return res.status(200).json({
        imported: result.imported,
        ignored: result.ignored,
        durationMs: result.durationMs,
      });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { level, search, page, limit, startDate, endDate } = req.query;

      const parsedPage = page === undefined || page === '' ? 1 : Number(page);
      const parsedLimit = limit === undefined || limit === '' ? 20 : Number(limit);

      if (!Number.isInteger(parsedPage) || parsedPage < 1) {
        throw new HttpError(400, 'Parâmetros inválidos: page deve ser um número inteiro maior que zero');
      }

      if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
        throw new HttpError(400, 'Parâmetros inválidos: limit deve ser um número inteiro maior que zero');
      }

      const start = this.parseDateFilter(startDate, 'startDate');
      const end = this.parseDateFilter(endDate, 'endDate');

      if (start && end && start > end) {
        throw new HttpError(400, 'A data inicial deve ser anterior ou igual à data final');
      }

      const data = await this.queryService.list({
        level: level ? String(level) as any : undefined,
        search: search ? String(search) : undefined,
        page: parsedPage,
        limit: parsedLimit,
        startDate: start,
        endDate: end,
      });

      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  stats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.queryService.stats();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  };

  trends = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.queryService.trends();
      return res.json(data);
    } catch (error) {
      next(error);
    }
  };
}
