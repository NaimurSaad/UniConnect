import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AccountStatus } from '@/common/enums/account-status.enum';
import { UserProfile } from './user-profile.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'full_name', length: 120 })
  fullName!: string;

  @Column({ length: 255, unique: true })
  email!: string;

  @Column({ name: 'password_hash', length: 255 })
  passwordHash!: string;

  @Column({ name: 'account_status', type: 'varchar', length: 20, default: AccountStatus.PENDING })
  accountStatus!: AccountStatus;

  @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
  profile?: UserProfile;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
