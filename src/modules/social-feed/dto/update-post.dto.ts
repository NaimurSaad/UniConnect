import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PostVisibility } from '../entities/feed-post.entity';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}

