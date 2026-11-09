import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { FacultyProfile } from './entities/faculty-profile.entity';
import { AlumniProfile } from './entities/alumni-profile.entity';
import { AffiliationRequest } from './entities/affiliation-request.entity';
import { User } from '@/modules/user/entities/user.entity';
import { AffiliationController } from './affiliation.controller';
import { AffiliationService } from './affiliation.service';

@Module({
    imports: [TypeOrmModule.forFeature([StudentProfile, FacultyProfile, AlumniProfile, AffiliationRequest, User])],
    controllers: [AffiliationController],
    providers: [AffiliationService],
    exports: [AffiliationService, TypeOrmModule],
})
export class AffiliationModule { }