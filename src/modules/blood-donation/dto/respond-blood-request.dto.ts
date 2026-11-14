import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RespondBloodRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}