import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ContentReport } from './entities/content-report.entity';
import { ModerationAction } from './entities/moderation-action.entity';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '@/modules/user/entities/user.entity';
import { AccountStatus } from '@/common/enums/account-status.enum';
import { ModerationActionType } from '@/common/enums/moderation-action-type.enum';
import { ReportStatus } from '@/common/enums/report-status.enum';
import { AuditLogQueryDto, CreateContentReportDto, CreateModerationActionDto, ReviewReportDto } from './dto/moderation.dto';

@Injectable()
export class ModerationService {
    constructor(
        @InjectRepository(ContentReport) private readonly reportRepo: Repository<ContentReport>,
        @InjectRepository(ModerationAction) private readonly actionRepo: Repository<ModerationAction>,
        @InjectRepository(AuditLog) private readonly auditRepo: Repository<AuditLog>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly dataSource: DataSource,
    ) { }

    // Create content report
    async createReport(reporterId: string, dto: CreateContentReportDto) {
        const report = this.reportRepo.create({
            reporterId,
            ...dto,
            status: ReportStatus.PENDING,
        });
        return await this.reportRepo.save(report);
    }

    // Get reports list
    async getReports(status?: ReportStatus) {
        const where = status ? { status } : {};
        return await this.reportRepo.find({
            where,
            relations: ['reporter', 'reviewer'],
            order: { createdAt: 'DESC' },
        });
    }

    // Get single report
    async getReportById(id: string) {
        const report = await this.reportRepo.findOne({
            where: { id },
            relations: ['reporter', 'reviewer'],
        });
        if (!report) throw new NotFoundException(`Report with ID ${id} not found`);
        return report;
    }

    // Review report decision
    async reviewReport(id: string, reviewerId: string, reviewerName: string, dto: ReviewReportDto) {
        const report = await this.getReportById(id);
        report.status = dto.status;
        report.reviewedBy = reviewerId;
        report.reviewedAt = new Date();
        const updated = await this.reportRepo.save(report);

        // Write audit log
        await this.auditRepo.save(
            this.auditRepo.create({
                actorId: reviewerId,
                actorName: reviewerName,
                action: 'REPORT_REVIEWED',
                entityName: 'ContentReport',
                entityId: id,
                details: { newStatus: dto.status },
            }),
        );

        return updated;
    }

    // Take moderation action inside a database transaction
    async takeModerationAction(
        moderatorId: string,
        moderatorName: string,
        dto: CreateModerationActionDto,
        ipAddress?: string,
    ) {
        const qr = this.dataSource.createQueryRunner();
        await qr.connect();
        await qr.startTransaction();

        try {
            // Check target user
            const targetUser = await qr.manager.findOne(User, { where: { id: dto.targetUserId } });
            if (!targetUser) {
                throw new NotFoundException(`Target user with ID ${dto.targetUserId} not found`);
            }

            // Record moderation action
            const action = qr.manager.create(ModerationAction, {
                moderatorId,
                targetUserId: dto.targetUserId,
                actionType: dto.actionType,
                reason: dto.reason,
                reportId: dto.reportId,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
            });
            const savedAction = await qr.manager.save(action);

            // Ban user if action is ban
            if (dto.actionType === ModerationActionType.BAN) {
                await qr.manager.update(User, dto.targetUserId, { accountStatus: AccountStatus.BANNED });
            }

            // Update linked report if exists
            if (dto.reportId) {
                await qr.manager.update(ContentReport, dto.reportId, {
                    status: ReportStatus.ACTION_TAKEN,
                    reviewedBy: moderatorId,
                    reviewedAt: new Date(),
                });
            }

            // Record audit log
            const auditLog = qr.manager.create(AuditLog, {
                actorId: moderatorId,
                actorName: moderatorName,
                action: `USER_${dto.actionType.toUpperCase()}`,
                entityName: 'User',
                entityId: dto.targetUserId,
                details: {
                    actionId: savedAction.id,
                    reason: dto.reason,
                    actionType: dto.actionType,
                },
                ipAddress,
            });
            await qr.manager.save(auditLog);

            // Commit transaction
            await qr.commitTransaction();
            return savedAction;
        } catch (err) {
            // Rollback on failure
            await qr.rollbackTransaction();
            throw err;
        } finally {
            await qr.release();
        }
    }

    // Fetch audit logs with pagination
    async getAuditLogs(query: AuditLogQueryDto) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        const queryBuilder = this.auditRepo
            .createQueryBuilder('audit')
            .leftJoinAndSelect('audit.actor', 'actor')
            .orderBy('audit.createdAt', 'DESC')
            .skip(skip)
            .take(limit);

        if (query.entityName) {
            queryBuilder.where('audit.entityName = :entityName', { entityName: query.entityName });
        }

        const [data, total] = await queryBuilder.getManyAndCount();

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}