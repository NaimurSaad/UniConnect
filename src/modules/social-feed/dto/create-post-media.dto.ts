import {
  IsEnum,
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostMediaType } from '../enums/social-feed.enums';

export class CreatePostMediaDto {
  @IsEnum(PostMediaType, {
    message: 'media_type must be either image or video',
  })
  media_type: PostMediaType;

  @IsString({ message: 'file_url must be a string' })
  @IsNotEmpty({ message: 'file_url is required' })
  file_url: string;

  @IsString({ message: 'mime_type must be a string' })
  @IsNotEmpty({ message: 'mime_type is required' })
  mime_type: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'file_size_bytes must be a number' })
  @Min(1, { message: 'file_size_bytes must be at least 1' })
  file_size_bytes: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'sort_order must be an integer' })
  @Min(0, { message: 'sort_order cannot be negative' })
  sort_order?: number = 0;
}

