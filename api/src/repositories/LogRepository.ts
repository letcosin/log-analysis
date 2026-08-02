import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Log, LogLevel } from '../entities/Log';

export type LogFilters = {
  level?: LogLevel;
  search?: string;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
};

export class LogRepository {
  private repository: Repository<Log>;

  constructor() {
    this.repository = AppDataSource.getRepository(Log);
  }

  async saveMany(logs: Partial<Log>[]): Promise<Log[]> {
    return this.repository.save(logs as Log[]);
  }

  async findAll(filters: LogFilters = {}) {
    const { level, search, page = 1, limit = 20, startDate, endDate } = filters;
    const query = this.repository
      .createQueryBuilder('log')
      .orderBy('log.timestamp', 'DESC');

    if (level) {
      query.andWhere('log.level = :level', { level });
    }

    if (search) {
      query.andWhere('log.message ILIKE :search', { search: `%${search}%` });
    }

    if (startDate) {
      query.andWhere('log.timestamp >= :startDate', { startDate });
    }

    if (endDate) {
      query.andWhere('log.timestamp <= :endDate', { endDate });
    }

    const total = await query.getCount();
    const data = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async getStats() {
    const total = await this.repository.count();

    const byLevel = await this.repository
      .createQueryBuilder('log')
      .select('log.level', 'level')
      .addSelect('COUNT(log.id)', 'count')
      .groupBy('log.level')
      .getRawMany();

    const timeline = await this.repository
      .createQueryBuilder('log')
      .select("DATE_TRUNC('hour', log.timestamp)", 'period')
      .addSelect('COUNT(log.id)', 'count')
      .groupBy("DATE_TRUNC('hour', log.timestamp)")
      .orderBy("DATE_TRUNC('hour', log.timestamp)", 'ASC')
      .getRawMany();

    return {
      total,
      byLevel,
      timeline,
    };
  }

  async getTrends() {
    const total = await this.repository.count();
    const groupBy = total <= 200
      ? "DATE_TRUNC('hour', log.timestamp)"
      : "DATE_TRUNC('day', log.timestamp)";

    const rows = await this.repository
      .createQueryBuilder('log')
      .select(groupBy, 'period')
      .addSelect('COUNT(log.id)', 'count')
      .groupBy(groupBy)
      .orderBy(groupBy, 'ASC')
      .getRawMany();

    return rows.map((row) => {
      const rawPeriod = row.period as string | Date | undefined;
      const parsed = rawPeriod ? new Date(rawPeriod) : null;
      const period = parsed && !Number.isNaN(parsed.getTime())
        ? parsed.toISOString().slice(0, total <= 200 ? 13 : 10)
        : String(rawPeriod ?? '');

      return {
        period,
        count: Number(row.count ?? 0),
      };
    });
  }
}
