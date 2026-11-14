import { IsEnum, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { LostFoundStatus } from '../entities/lost-found-post.entity';

export class UpdateLostFoundPostDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  itemCategory?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location?: string;

  @IsOptional()
  @IsDateString()
  eventDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @IsOptional()
  @IsEnum(LostFoundStatus, { message: 'status must be active, resolved, or closed' })
  status?: LostFoundStatus;
}