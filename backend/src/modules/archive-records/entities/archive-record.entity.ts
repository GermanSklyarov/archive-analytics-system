import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Index(['created_at'])
@Index(['category'])
@Index(['created_at', 'userId'])
@Index(['category', 'value', 'created_at', 'userId'], { unique: true })
@Entity()
export class ArchiveRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column()
  tag: string;

  @Column({ nullable: true })
  unit?: string;

  @Column()
  category: string;

  @Column('float')
  value: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
