import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
  IsNumber,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostMediaType, PostVisibility } from '../enums/social-feed.enums';
import { IsContentOrMediaPresent } from '../validators/is-content-or-media-present.validator';

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
  @IsNumber({}, { message: 'sort_order must be a number' })
  sort_order?: number;
}

export class CreatePostDto {
  @IsNotEmpty({ message: 'author_id is required' })
  @IsUUID('all', { message: 'author_id must be a valid UUID' })
  author_id: string;

  @IsContentOrMediaPresent()
  @ValidateIf((o) => !o.media || o.media.length === 0 || o.content !== undefined)
  @IsString({ message: 'content must be a string' })
  content?: string;

  @IsOptional()
  @IsEnum(PostVisibility, {
    message: 'visibility must be community',
  })
  visibility?: PostVisibility = PostVisibility.COMMUNITY;

  @IsOptional()
  @IsArray({ message: 'media must be an array' })
  @ValidateNested({ each: true })
  @Type(() => CreatePostMediaDto)
  media?: CreatePostMediaDto[];
}
