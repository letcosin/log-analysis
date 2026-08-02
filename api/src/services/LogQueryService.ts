import { LogRepository, LogFilters } from '../repositories/LogRepository';

export class LogQueryService {
  constructor(private readonly logRepository = new LogRepository()) {}

  async list(filters: LogFilters = {}) {
    return this.logRepository.findAll(filters);
  }

  async stats() {
    return this.logRepository.getStats();
  }
}
