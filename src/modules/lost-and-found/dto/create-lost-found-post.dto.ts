import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString, MaxLength } from 'class-validator';
import { LostFoundType } from '../entities/lost-found-post.entity';

export class CreateLostFoundPostDto {
  @IsEnum(LostFoundType, { message: 'postType must be either lost or found' })
  @IsNotEmpty()
  postType!: LostFoundType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  itemCategory!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  location?: string;

  @IsOptional()
  @IsDateString({}, { message: 'eventDate must be a valid ISO date string (YYYY-MM-DD)' })
  eventDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;
}