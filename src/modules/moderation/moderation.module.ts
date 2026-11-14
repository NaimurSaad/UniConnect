import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentReport } from './entities/content-report.entity';
import { ModerationAction } from './entities/moderation-action.entity';
import { AuditLog } from './entities/audit-log.entity';
import { User } from '@/modules/user/entities/user.entity';
import { ModerationController } from './moderation.controller';
import { ModerationService } from './moderation.service';

@Module({
    imports: [TypeOrmModule.forFeature([ContentReport, ModerationAction, AuditLog, User])],
    controllers: [ModerationController],
    providers: [ModerationService],
    exports: [ModerationService, TypeOrmModule],
})
export class ModerationModule { }