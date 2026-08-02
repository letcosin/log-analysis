import { Request, Response, NextFunction } from 'express';
import { LogImportService } from '../services/LogImportService';
import { LogQueryService } from '../services/LogQueryService';

export class LogController {
  constructor(
    private readonly importService = new LogImportService(),
    private readonly queryService = new LogQueryService(),
  ) {}

  import = async (req: Request, res: Response, next: NextFunction) => {
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
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { level, search, page, limit } = req.query;

      const data = await this.queryService.list({
        level: level as any,
        search: search ? String(search) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20,
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
}
