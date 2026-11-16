import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, Column } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Project } from './project.entity';

@Entity({ name: 'project_reactions' })
@Unique(['projectId', 'userId'])
export class ProjectReaction {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'project_id', type: 'uuid' })
    projectId!: string;

    @ManyToOne(() => Project, (project) => project.reactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;

    @Column({ name: 'user_id', type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}