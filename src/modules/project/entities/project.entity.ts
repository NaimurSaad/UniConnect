import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { ProjectComment } from './project-comment.entity';
import { ProjectReaction } from './project-reaction.entity';

@Entity({ name: 'projects' })
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'author_id', type: 'uuid' })
    authorId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'author_id' })
    author!: User;

    @Column({ length: 255 })
    title!: string;

    @Column({ type: 'text' })
    description!: string;

    @Column({ name: 'course_name', length: 150, nullable: true })
    courseName?: string;

    @Column({ length: 50, nullable: true })
    semester?: string;

    @Column({ name: 'tech_stack', length: 255, nullable: true })
    techStack?: string;

    @Column({ name: 'github_url', length: 255, nullable: true })
    githubUrl?: string;

    @Column({ name: 'live_url', length: 255, nullable: true })
    liveUrl?: string;

    @OneToMany(() => ProjectComment, (comment) => comment.project)
    comments?: ProjectComment[];

    @OneToMany(() => ProjectReaction, (reaction) => reaction.project)
    reactions?: ProjectReaction[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}