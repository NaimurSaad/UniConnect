import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { NotificationType } from '../enums/notification-type.enum';

export { NotificationType };

@Entity('notifications')
@Index(['user_id', 'read_at'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'varchar', length: 60 })
  notification_type!: string;

  @Column({ type: 'varchar', length: 500 })
  message!: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  related_entity_type!: string | null;

  @Column({ type: 'uuid', nullable: true })
  related_entity_id!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  read_at!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;
}

