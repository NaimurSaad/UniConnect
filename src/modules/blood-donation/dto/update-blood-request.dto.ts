import { IsEnum, IsInt, IsOptional, IsString, Min, IsDateString, MaxLength } from 'class-validator';
import { BloodRequestStatus } from '../entities/blood-request.entity';

export class UpdateBloodRequestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  units?: number;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  hospital?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location?: string;

  @IsOptional()
  @IsDateString()
  neededBy?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  contactInfo?: string;

  @IsOptional()
  @IsEnum(BloodRequestStatus)
  status?: BloodRequestStatus;
}