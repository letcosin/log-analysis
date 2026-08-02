import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 20 })
  level!: LogLevel;

  @Column({ type: 'timestamptz' })
  timestamp!: Date;

  @Column({ type: 'text' })
  message!: string;

  @Column({ type: 'text', nullable: true })
  source?: string | null;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  metadata?: Record<string, unknown> | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;
}
