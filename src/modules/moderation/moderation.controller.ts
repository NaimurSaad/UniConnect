import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { AuditLogQueryDto, CreateContentReportDto, CreateModerationActionDto, ReviewReportDto } from './dto/moderation.dto';
import { JwtGuard, RolesGuard } from '@/common/guard';
import { Roles } from '@/common/decorators';
import { Role } from '@/common/enums/role.enum';
import { ReportStatus } from '@/common/enums/report-status.enum';

@Controller('moderation')
export class ModerationController {
    constructor(private readonly moderationService: ModerationService) { }

    // Submit a report 
    @Post('reports')
    @UseGuards(JwtGuard)
    async createReport(@Request() req: any, @Body() dto: CreateContentReportDto) {
        const reporterId = req.user.user_id || req.user.id || req.user.sub;
        return await this.moderationService.createReport(reporterId, dto);
    }

    // Get all reports
    @Get('reports')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.MODERATOR)
    async getReports(@Query('status') status?: ReportStatus) {
        return await this.moderationService.getReports(status);
    }

    // Get single report
    @Get('reports/:id')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.MODERATOR)
    async getReportById(@Param('id', ParseUUIDPipe) id: string) {
        return await this.moderationService.getReportById(id);
    }

    // Review a report
    @Patch('reports/:id/review')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.MODERATOR)
    async reviewReport(
        @Request() req: any,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: ReviewReportDto,
    ) {
        const reviewerId = req.user.user_id || req.user.id || req.user.sub;
        const reviewerName = req.user.name || 'Moderator';
        return await this.moderationService.reviewReport(id, reviewerId, reviewerName, dto);
    }

    @Post('actions')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.MODERATOR)
    async takeAction(
        @Request() req: any,
        @Body() dto: CreateModerationActionDto,
    ) {
        const moderatorId = req.user.user_id || req.user.id || req.user.sub;
        const moderatorName = req.user.name || 'Moderator';
        const ipAddress = req.ip || req.connection?.remoteAddress;
        return await this.moderationService.takeModerationAction(moderatorId, moderatorName, dto, ipAddress);
    }


    @Get('audit-logs')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getAuditLogs(@Query() query: AuditLogQueryDto) {
        return await this.moderationService.getAuditLogs(query);
    }
}