import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class AnalyticsRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  dateFrom?: string;

  @Column({ nullable: true })
  dateTo?: string;

  @Column()
  aggregationType: string;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
