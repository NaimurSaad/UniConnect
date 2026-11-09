import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PostVisibility } from '../enums/social-feed.enums';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(PostVisibility)
  visibility?: PostVisibility;
}

