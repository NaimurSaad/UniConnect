import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
  Check,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ConnectionStatus } from '../enums/connection-status.enum';

export { ConnectionStatus };

@Entity('connections')
@Unique(['requester_id', 'receiver_id'])
@Check('"requester_id" <> "receiver_id"')
export class Connection {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  requester_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requester_id' })
  requester!: User;

  @Column({ type: 'uuid' })
  receiver_id!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'receiver_id' })
  receiver!: User;

  @Column({
    type: 'enum',
    enum: ConnectionStatus,
    enumName: 'connections_status_enum',
    default: ConnectionStatus.PENDING,
  })
  status!: ConnectionStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;
}

