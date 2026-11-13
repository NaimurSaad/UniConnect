import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, IsDateString, MaxLength } from 'class-validator';
import { BloodGroup } from '../entities/blood-request.entity';

export class CreateBloodRequestDto {
  @IsEnum(BloodGroup, { message: 'Invalid blood group' })
  @IsNotEmpty()
  bloodGroup!: BloodGroup;

  @IsInt()
  @Min(1, { message: 'Units must be at least 1' })
  units!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  hospital!: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location?: string;

  @IsDateString({}, { message: 'neededBy must be a valid ISO date string' })
  @IsNotEmpty()
  neededBy!: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  contactInfo?: string;
}