import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsUUID,
  IsNotEmpty,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PostVisibility } from '../enums/social-feed.enums';
import { IsContentOrMediaPresent } from '../validators/is-content-or-media-present.validator';
import { CreatePostMediaDto } from './create-post-media.dto';

// Re-export for backward compatibility
export { CreatePostMediaDto };

export class CreatePostDto {
  @IsNotEmpty({ message: 'author_id is required' })
  @IsUUID('all', { message: 'author_id must be a valid UUID' })
  author_id: string;

  @IsContentOrMediaPresent()
  @ValidateIf((o) => !o.media || o.media.length === 0 || o.content !== undefined)
  @IsString({ message: 'content must be a string' })
  @MaxLength(5000, { message: 'content cannot exceed 5000 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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
