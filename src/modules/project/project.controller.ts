import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectCommentDto, CreateProjectDto, ProjectQueryDto, UpdateProjectDto } from './dto/project.dto';
import { JwtGuard } from '@/common/guard';
import { Role } from '@/common/enums/role.enum';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    // 1. Create a project showcase
    @Post()
    @UseGuards(JwtGuard)
    async createProject(@Request() req: any, @Body() dto: CreateProjectDto) {
        const authorId = req.user.user_id || req.user.id || req.user.sub;
        return await this.projectService.createProject(authorId, dto);
    }

    // 2. Get all projects (public with filters & search)
    @Get()
    async getProjects(@Query() query: ProjectQueryDto) {
        return await this.projectService.getProjects(query);
    }

    // 3. Get single project details (with comments and reactions)
    @Get(':id')
    async getProjectById(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
        const currentUserId = req.user?.user_id || req.user?.id || req.user?.sub;
        return await this.projectService.getProjectById(id, currentUserId);
    }

    // 4. Update own project
    @Patch(':id')
    @UseGuards(JwtGuard)
    async updateProject(
        @Request() req: any,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UpdateProjectDto,
    ) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        return await this.projectService.updateProject(id, userId, dto);
    }

    // 5. Delete project (author or admin)
    @Delete(':id')
    @UseGuards(JwtGuard)
    async deleteProject(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        const isAdmin = req.user.role === Role.ADMIN || req.user.role === Role.SUPER_ADMIN;
        return await this.projectService.deleteProject(id, userId, isAdmin);
    }

    // 6. Toggle Star / Like on a project
    @Post(':id/react')
    @UseGuards(JwtGuard)
    async toggleReaction(@Request() req: any, @Param('id', ParseUUIDPipe) id: string) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        return await this.projectService.toggleReaction(id, userId);
    }

    // 7. Add a comment to a project
    @Post(':id/comments')
    @UseGuards(JwtGuard)
    async addComment(
        @Request() req: any,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: CreateProjectCommentDto,
    ) {
        const authorId = req.user.user_id || req.user.id || req.user.sub;
        return await this.projectService.addComment(id, authorId, dto);
    }

    // 8. Delete a comment (comment author or admin)
    @Delete('comments/:commentId')
    @UseGuards(JwtGuard)
    async deleteComment(@Request() req: any, @Param('commentId', ParseUUIDPipe) commentId: string) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        const isAdmin = req.user.role === Role.ADMIN || req.user.role === Role.SUPER_ADMIN;
        return await this.projectService.deleteComment(commentId, userId, isAdmin);
    }
}