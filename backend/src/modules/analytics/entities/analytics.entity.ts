import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class AnalyticsRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  aggregationType: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  dateFrom?: string;

  @Column({ nullable: true })
  dateTo?: string;

  @Column({ type: 'jsonb', nullable: true })
  filters?: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;
}
