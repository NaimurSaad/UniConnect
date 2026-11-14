import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ReportStatus } from '@/common/enums/report-status.enum';
import { ModerationActionType } from '@/common/enums/moderation-action-type.enum';

export class CreateContentReportDto {
    @IsNotEmpty()
    @IsString()
    targetType!: string;

    @IsNotEmpty()
    @IsString()
    targetId!: string;

    @IsNotEmpty()
    @IsString()
    reason!: string;
}

export class ReviewReportDto {
    @IsNotEmpty()
    @IsEnum(ReportStatus)
    status!: ReportStatus;
}

export class CreateModerationActionDto {
    @IsNotEmpty()
    @IsUUID()
    targetUserId!: string;

    @IsNotEmpty()
    @IsEnum(ModerationActionType)
    actionType!: ModerationActionType;

    @IsNotEmpty()
    @IsString()
    reason!: string;

    @IsOptional()
    @IsUUID()
    reportId?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}

export class AuditLogQueryDto {
    @IsOptional()
    @IsString()
    entityName?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}