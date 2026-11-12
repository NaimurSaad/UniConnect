import {
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  IsDateString,
} from "class-validator";

import {
  JobStatus,
  JobType,
} from "../entities/job-post.entity";

export class CreateJobDto {
  @IsString()
  @MaxLength(180)
  title: string = "";

  @IsString()
  @MaxLength(180)
  organization: string = "";

  @IsEnum(JobType)
  jobType: JobType = JobType.JOB; // Enum এর জন্য ডিফল্ট ভ্যালু দেওয়া হয়েছে

  @IsString()
  description: string = "";

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location: string = "";

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  applicationUrl: string = "";

  @IsOptional()
  @IsDateString()
  deadline: string = "";

  @IsOptional()
  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.OPEN;
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MaxLength(180)
  title: string = "";

  @IsOptional()
  @IsString()
  @MaxLength(180)
  organization: string = "";

  @IsOptional()
  @IsEnum(JobType)
  jobType: JobType = JobType.JOB;

  @IsOptional()
  @IsString()
  description: string = "";

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location: string = "";

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  applicationUrl: string = "";

  @IsOptional()
  @IsDateString()
  deadline: string = "";

  @IsOptional()
  @IsEnum(JobStatus)
  status: JobStatus = JobStatus.OPEN;
}