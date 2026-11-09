import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostVisibility } from '../entities/feed-post.entity';
import { MediaType } from '../entities/post-media.entity';

export class CreatePostMediaDto {
  @IsEnum(MediaType, { message: 'media_type must be either image or video' })
  media_type: MediaType;

  @IsString({ message: 'file_url must be a valid string or URL' })
  file_url: string;

  @IsString()
  mime_type: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  file_size_bytes: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sort_order?: number;
}

export class CreatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMediaDto)
  media?: CreatePostMediaDto[];

  @IsOptional()
  @IsString()
  author_id?: string;
}

