import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateFacultyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  code!: string;
}

export class UpdateFacultyDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  code?: string;
}
