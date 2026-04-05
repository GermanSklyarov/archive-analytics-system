import { AnalyticsRequest } from 'src/modules/analytics/entities/analytics.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AnalyticsResult {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => AnalyticsRequest)
  @JoinColumn()
  request: AnalyticsRequest;

  @Column({ type: 'jsonb' })
  result_data: any;

  @CreateDateColumn()
  created_at: Date;
}
