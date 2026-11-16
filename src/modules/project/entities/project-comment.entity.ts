import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Project } from './project.entity';

@Entity({ name: 'project_comments' })
export class ProjectComment {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'project_id', type: 'uuid' })
    projectId!: string;

    @ManyToOne(() => Project, (project) => project.comments, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' })
    project!: Project;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author!: User;

    @Column({ type: 'text' })
    content!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}