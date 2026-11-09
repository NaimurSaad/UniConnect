import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';

@Entity({ name: 'audit_logs' })
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'actor_id', type: 'uuid', nullable: true })
    actorId?: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'actor_id' })
    actor?: User;

    @Column({ name: 'actor_name', length: 120, nullable: true })
    actorName?: string;

    @Column({ length: 100 })
    action!: string;

    @Column({ name: 'entity_name', length: 50 })
    entityName!: string;

    @Column({ name: 'entity_id', length: 100 })
    entityId!: string;

    @Column({ type: 'jsonb', nullable: true })
    details?: Record<string, any>;

    @Column({ name: 'ip_address', length: 45, nullable: true })
    ipAddress?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}