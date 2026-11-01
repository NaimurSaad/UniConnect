import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { DegreeLevel } from '@/common/enums/degree-level.enum';

export class CreateAcademicProgramDto {
  @IsNotEmpty()
  @IsInt()
  departmentId!: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  name!: string;

  @IsOptional()
  @IsEnum(DegreeLevel)
  degreeLevel?: DegreeLevel;
}

export class UpdateAcademicProgramDto {
  @IsOptional()
  @IsInt()
  departmentId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsEnum(DegreeLevel)
  degreeLevel?: DegreeLevel;
}
