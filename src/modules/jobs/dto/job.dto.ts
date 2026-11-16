import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, ValidateIf } from "class-validator";
import { JobStatus, JobType } from "../entities/job-post.entity";
import { ApplicationStatus } from "../entities/job-application.entity";

export class CreateJobDto {
    @IsString()
    @IsNotEmpty({message:"Title can not be empty"})
    title!: string;

    @IsString()
    @IsNotEmpty({message:"Organization can not be empty"})
    organization!: string;

    @IsEnum(JobType)
    @IsNotEmpty()
    jobType!: JobType;

    @IsString()
    @IsNotEmpty({message:"Description can not be empty"})
    description!: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsUrl()
    applicationUrl?: string;

    @IsOptional()
    @IsDateString()
    deadline?: string;

    @IsOptional()
    @IsEnum(JobStatus)
    status?: JobStatus;

    @IsOptional()
    created_at?: Date = new Date();

    @IsOptional()
    updated_at?: Date = new Date();
}

export class UpdateJobDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    organization?: string;

    @IsOptional()
    @IsEnum(JobType)
    jobType?: JobType;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsUrl()
    applicationUrl?: string;

    @IsOptional()
    @IsDateString()
    deadline?: string;

    @IsOptional()
    @IsEnum(JobStatus)
    status?: JobStatus;

    @IsOptional()
    updated_at?: Date = new Date();
}

export class ApplyJobDto {
    @IsOptional()
    @IsString()
    coverLetter?: string;

    @IsOptional()
    @IsUrl()
    resumeUrl?: string;

    @IsOptional()
    created_at?: Date = new Date();
}

export class UpdateApplicationDto {
    @IsEnum(ApplicationStatus)
    @IsNotEmpty()
    status!: ApplicationStatus;

    @IsOptional()
    updated_at?: Date = new Date();
}