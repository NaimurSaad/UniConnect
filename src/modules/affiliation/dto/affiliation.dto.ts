import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AffiliationStatus } from '@/common/enums/affiliation-status.enum';

export class CreateStudentAffiliationDto {
    @IsNotEmpty()
    @IsString()
    studentId!: string;

    @IsNotEmpty()
    @IsInt()
    programId!: number;
}

export class CreateFacultyAffiliationDto {
    @IsNotEmpty()
    @IsInt()
    facultyId!: number;

    @IsNotEmpty()
    @IsString()
    designation!: string;

    @IsNotEmpty()
    @IsEmail()
    officialEmail!: string;

    @IsOptional()
    @IsString()
    officeRoom?: string;
}

export class CreateAlumniAffiliationDto {
    @IsNotEmpty()
    @IsInt()
    graduationYear!: number;

    @IsNotEmpty()
    @IsInt()
    programId!: number;

    @IsOptional()
    @IsString()
    currentCompany?: string;

    @IsOptional()
    @IsString()
    currentJobTitle?: string;
}

export class ReviewAffiliationRequestDto {
    @IsNotEmpty()
    @IsEnum(AffiliationStatus)
    status!: AffiliationStatus;
}