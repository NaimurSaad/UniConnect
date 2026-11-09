import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { AffiliationType } from '@/common/enums/affiliation-type.enum';
import { AffiliationStatus } from '@/common/enums/affiliation-status.enum';

@Entity({ name: 'affiliation_requests' })
export class AffiliationRequest {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'affiliation_type', type: 'varchar', length: 20 })
    affiliationType!: AffiliationType;

    @Column({ name: 'status', type: 'varchar', length: 20, default: AffiliationStatus.PENDING })
    status!: AffiliationStatus;

    @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
    reviewedBy?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'reviewed_by' })
    reviewer?: User;

    @Column({ name: 'reviewed_at', type: 'timestamp', nullable: true })
    reviewedAt?: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}