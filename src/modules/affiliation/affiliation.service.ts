import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentProfile } from './entities/student-profile.entity';
import { FacultyProfile } from './entities/faculty-profile.entity';
import { AlumniProfile } from './entities/alumni-profile.entity';
import { AffiliationRequest } from './entities/affiliation-request.entity';
import { User } from '@/modules/user/entities/user.entity';
import { AffiliationType } from '@/common/enums/affiliation-type.enum';
import { AffiliationStatus } from '@/common/enums/affiliation-status.enum';
import { AccountStatus } from '@/common/enums/account-status.enum';
import { CreateAlumniAffiliationDto, CreateFacultyAffiliationDto, CreateStudentAffiliationDto, ReviewAffiliationRequestDto } from './dto/affiliation.dto';

@Injectable()
export class AffiliationService {
    constructor(
        @InjectRepository(StudentProfile) private readonly studentRepo: Repository<StudentProfile>,
        @InjectRepository(FacultyProfile) private readonly facultyRepo: Repository<FacultyProfile>,
        @InjectRepository(AlumniProfile) private readonly alumniRepo: Repository<AlumniProfile>,
        @InjectRepository(AffiliationRequest) private readonly requestRepo: Repository<AffiliationRequest>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    async submitStudentAffiliation(userId: string, dto: CreateStudentAffiliationDto) {
        const existing = await this.studentRepo.findOne({ where: { studentId: dto.studentId } });
        if (existing) {
            throw new ConflictException('Student ID is already registered');
        }

        const profile = this.studentRepo.create({ userId, ...dto });
        const savedProfile = await this.studentRepo.save(profile);

        const request = this.requestRepo.create({
            userId,
            affiliationType: AffiliationType.STUDENT,
            status: AffiliationStatus.PENDING,
        });
        await this.requestRepo.save(request);

        return { profile: savedProfile, request };
    }

    async submitFacultyAffiliation(userId: string, dto: CreateFacultyAffiliationDto) {
        const existing = await this.facultyRepo.findOne({ where: { officialEmail: dto.officialEmail } });
        if (existing) {
            throw new ConflictException('Official email is already registered');
        }

        const profile = this.facultyRepo.create({ userId, ...dto });
        const savedProfile = await this.facultyRepo.save(profile);

        const request = this.requestRepo.create({
            userId,
            affiliationType: AffiliationType.FACULTY,
            status: AffiliationStatus.PENDING,
        });
        await this.requestRepo.save(request);

        return { profile: savedProfile, request };
    }

    async submitAlumniAffiliation(userId: string, dto: CreateAlumniAffiliationDto) {
        const profile = this.alumniRepo.create({ userId, ...dto });
        const savedProfile = await this.alumniRepo.save(profile);

        const request = this.requestRepo.create({
            userId,
            affiliationType: AffiliationType.ALUMNI,
            status: AffiliationStatus.PENDING,
        });
        await this.requestRepo.save(request);

        return { profile: savedProfile, request };
    }

    async getPendingRequests() {
        return await this.requestRepo.find({
            where: { status: AffiliationStatus.PENDING },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
    }

    async getAllRequests() {
        return await this.requestRepo.find({
            relations: ['user', 'reviewer'],
            order: { createdAt: 'DESC' },
        });
    }

    async reviewRequest(requestId: string, adminId: string, dto: ReviewAffiliationRequestDto) {
        const request = await this.requestRepo.findOne({ where: { id: requestId } });
        if (!request) {
            throw new NotFoundException(`Affiliation request with ID ${requestId} not found`);
        }

        request.status = dto.status;
        request.reviewedBy = adminId;
        request.reviewedAt = new Date();

        const updatedRequest = await this.requestRepo.save(request);

        if (dto.status === AffiliationStatus.APPROVED) {
            await this.userRepo.update(request.userId, { accountStatus: AccountStatus.ACTIVE });
        }

        return updatedRequest;
    }

    async getUserAffiliations(userId: string) {
        const [student, faculty, alumni, requests] = await Promise.all([
            this.studentRepo.findOne({ where: { userId }, relations: ['program'] }),
            this.facultyRepo.findOne({ where: { userId }, relations: ['faculty'] }),
            this.alumniRepo.findOne({ where: { userId }, relations: ['program'] }),
            this.requestRepo.find({ where: { userId }, order: { createdAt: 'DESC' } }),
        ]);

        return {
            student,
            faculty,
            alumni,
            requests,
        };
    }
}