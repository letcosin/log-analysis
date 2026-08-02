export type ParsedLogLine = {
  timestamp: Date;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  source?: string | null;
};

const LEVELS = ['INFO', 'WARN', 'ERROR', 'DEBUG'] as const;

export function parseLogLine(line: string): ParsedLogLine | null {
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

  if (!LEVELS.includes(level as typeof LEVELS[number])) {
    return null;
  }

  return {
    timestamp,
    level: level as ParsedLogLine['level'],
    message: message.trim(),
    source: null,
  };
}
