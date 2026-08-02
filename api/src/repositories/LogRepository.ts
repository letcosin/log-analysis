import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Log, LogLevel } from '../entities/Log';

export type LogFilters = {
  level?: LogLevel;
  search?: string;
  page?: number;
  limit?: number;
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
    const { level, search, page = 1, limit = 20 } = filters;
    const query = this.repository
      .createQueryBuilder('log')
      .orderBy('log.timestamp', 'DESC');

    if (level) {
      query.andWhere('log.level = :level', { level });
    }

    if (search) {
      query.andWhere('log.message ILIKE :search', { search: `%${search}%` });
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
}
