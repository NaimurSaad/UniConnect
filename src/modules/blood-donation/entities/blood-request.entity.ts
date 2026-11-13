import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity'; // আপনার User এনটিটির পাথ ঠিক করে নিন

export enum BloodGroup {
  A_POS = 'A+',
  A_NEG = 'A-',
  B_POS = 'B+',
  B_NEG = 'B-',
  AB_POS = 'AB+',
  AB_NEG = 'AB-',
  O_POS = 'O+',
  O_NEG = 'O-',
}

export enum BloodRequestStatus {
  OPEN = 'open',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity({ name: 'blood_requests' })
export class BloodRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Relation to User
  @ManyToOne(() => User)
  @JoinColumn({ name: 'requester_id' })
  requester!: User;

  @Column({ name: 'requester_id', type: 'uuid' })
  requesterId!: string;

  @Column({ name: 'blood_group', type: 'varchar', length: 10 })
  bloodGroup!: BloodGroup;

  @Column({ type: 'smallint', default: 1 })
  units!: number;

  @Column({ type: 'varchar', length: 180 })
  hospital!: string;

  @Column({ type: 'varchar', length: 180, nullable: true })
  location!: string | null;

  @Column({ name: 'needed_by', type: 'timestamp' })
  neededBy!: Date;

  @Column({ name: 'contact_info', type: 'varchar', length: 180, nullable: true })
  contactInfo!: string | null;

  @Column({ type: 'varchar', length: 20, default: BloodRequestStatus.OPEN })
  status!: BloodRequestStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}