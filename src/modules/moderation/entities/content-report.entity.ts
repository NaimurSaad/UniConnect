import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { ReportStatus } from '@/common/enums/report-status.enum';

@Entity({ name: 'content_reports' })
export class ContentReport {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'reporter_id', type: 'uuid' })
    reporterId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reporter_id' })
    reporter!: User;

    @Column({ name: 'target_type', length: 50 })
    targetType!: string;

    @Column({ name: 'target_id', length: 100 })
    targetId!: string;

    @Column({ type: 'text' })
    reason!: string;

    @Column({ type: 'varchar', length: 20, default: ReportStatus.PENDING })
    status!: ReportStatus;

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