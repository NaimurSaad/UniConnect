import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { ProjectComment } from './entities/project-comment.entity';
import { ProjectReaction } from './entities/project-reaction.entity';
import { CreateProjectCommentDto, CreateProjectDto, ProjectQueryDto, UpdateProjectDto } from './dto/project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(ProjectComment) private readonly commentRepo: Repository<ProjectComment>,
        @InjectRepository(ProjectReaction) private readonly reactionRepo: Repository<ProjectReaction>,
    ) { }

    // Create a new project showcase
    async createProject(authorId: string, dto: CreateProjectDto) {
        const project = this.projectRepo.create({ authorId, ...dto });
        return await this.projectRepo.save(project);
    }

    // Get all projects with optional search & filters
    async getProjects(query?: ProjectQueryDto) {
        const where: any = {};

        if (query?.course) {
            where.courseName = ILike(`%${query.course}%`);
        }
        if (query?.semester) {
            where.semester = query.semester;
        }
        if (query?.search) {
            where.title = ILike(`%${query.search}%`);
        }

        const projects = await this.projectRepo.find({
            where,
            relations: ['author', 'reactions', 'comments'],
            order: { createdAt: 'DESC' },
        });

        return projects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            courseName: p.courseName,
            semester: p.semester,
            techStack: p.techStack,
            githubUrl: p.githubUrl,
            liveUrl: p.liveUrl,
            author: {
                id: p.author?.id,
                fullName: p.author?.fullName,
                email: p.author?.email,
            },
            reactionCount: p.reactions?.length || 0,
            commentCount: p.comments?.length || 0,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    }

    // Get project by ID with details, comments, and reaction status
    async getProjectById(id: string, currentUserId?: string) {
        const project = await this.projectRepo.findOne({
            where: { id },
            relations: ['author', 'reactions', 'comments', 'comments.author'],
            order: { comments: { createdAt: 'ASC' } },
        });

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        const hasReacted = currentUserId
            ? project.reactions?.some((r) => r.userId === currentUserId)
            : false;

        return {
            ...project,
            author: {
                id: project.author?.id,
                fullName: project.author?.fullName,
                email: project.author?.email,
            },
            comments: project.comments?.map((c) => ({
                id: c.id,
                content: c.content,
                author: {
                    id: c.author?.id,
                    fullName: c.author?.fullName,
                },
                createdAt: c.createdAt,
            })),
            reactionCount: project.reactions?.length || 0,
            commentCount: project.comments?.length || 0,
            hasReacted,
        };
    }

    // Update own project
    async updateProject(id: string, userId: string, dto: UpdateProjectDto) {
        const project = await this.projectRepo.findOne({ where: { id } });
        if (!project) throw new NotFoundException('Project not found');

        if (project.authorId !== userId) {
            throw new ForbiddenException('You can only update your own project');
        }

        Object.assign(project, dto);
        return await this.projectRepo.save(project);
    }

    // Delete project (author or admin)
    async deleteProject(id: string, userId: string, isAdmin: boolean) {
        const project = await this.projectRepo.findOne({ where: { id } });
        if (!project) throw new NotFoundException('Project not found');

        if (project.authorId !== userId && !isAdmin) {
            throw new ForbiddenException('You can only delete your own project');
        }

        await this.projectRepo.delete({ id });
        return { message: 'Project deleted successfully' };
    }

    // Toggle reaction (Star / Like)
    async toggleReaction(projectId: string, userId: string) {
        const project = await this.projectRepo.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Project not found');

        const existing = await this.reactionRepo.findOne({ where: { projectId, userId } });
        if (existing) {
            await this.reactionRepo.delete({ id: existing.id });
            return { reacted: false, message: 'Reaction removed' };
        }

        const reaction = this.reactionRepo.create({ projectId, userId });
        await this.reactionRepo.save(reaction);
        return { reacted: true, message: 'Project starred' };
    }

    // Add comment
    async addComment(projectId: string, authorId: string, dto: CreateProjectCommentDto) {
        const project = await this.projectRepo.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException('Project not found');

        const comment = this.commentRepo.create({
            projectId,
            authorId,
            content: dto.content,
        });
        return await this.commentRepo.save(comment);
    }

    // Delete comment (author or admin)
    async deleteComment(commentId: string, userId: string, isAdmin: boolean) {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment) throw new NotFoundException('Comment not found');

        if (comment.authorId !== userId && !isAdmin) {
            throw new ForbiddenException('You can only delete your own comment');
        }

        await this.commentRepo.delete({ id: commentId });
        return { message: 'Comment deleted successfully' };
    }
}