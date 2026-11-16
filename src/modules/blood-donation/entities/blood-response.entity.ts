import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BloodRequest } from './blood-request.entity';

export enum BloodResponseStatus {
  OFFERED = 'offered',
  WITHDRAWN = 'withdrawn',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  COMPLETED = 'completed',
}

@Entity({ name: 'blood_responses' })
export class BloodResponse {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => BloodRequest)
  @JoinColumn({ name: 'request_id' })
  request!: BloodRequest;

  @Column({ name: 'request_id', type: 'uuid' })
  requestId!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'donor_id' })
  donor!: User;

  @Column({ name: 'donor_id', type: 'uuid' })
  donorId!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  message!: string | null;

  @Column({ type: 'varchar', length: 20, default: BloodResponseStatus.OFFERED })
  status!: BloodResponseStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}