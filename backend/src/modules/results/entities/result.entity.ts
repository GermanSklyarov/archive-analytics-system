import { AnalyticsRequest } from 'src/modules/analytics/entities/analytics.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AnalyticsResult {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AnalyticsRequest)
  @JoinColumn()
  request: AnalyticsRequest;

  @Column({ type: 'jsonb' })
  data: unknown;

  @Column()
  aggregationType: string;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  dateFrom?: string;

  @Column({ nullable: true })
  dateTo?: string;

  @CreateDateColumn()
  created_at: Date;
}
