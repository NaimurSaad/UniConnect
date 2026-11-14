import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { ContentReport } from './content-report.entity';
import { ModerationActionType } from '@/common/enums/moderation-action-type.enum';

@Entity({ name: 'moderation_actions' })
export class ModerationAction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'moderator_id', type: 'uuid' })
    moderatorId!: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'moderator_id' })
    moderator!: User;

    @Column({ name: 'target_user_id', type: 'uuid' })
    targetUserId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'target_user_id' })
    targetUser!: User;

    @Column({ name: 'report_id', type: 'uuid', nullable: true })
    reportId?: string;

    @ManyToOne(() => ContentReport, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'report_id' })
    report?: ContentReport;

    @Column({ name: 'action_type', type: 'varchar', length: 20 })
    actionType!: ModerationActionType;

    @Column({ type: 'text' })
    reason!: string;

    @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
    expiresAt?: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}