import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PostVisibility } from '../enums/social-feed.enums';

export class UpdatePostDto {
  @IsOptional()
  @IsString({ message: 'content must be a string' })
  @MaxLength(5000, { message: 'content cannot exceed 5000 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  content?: string;

  @IsOptional()
  @IsEnum(PostVisibility, { message: 'visibility must be community' })
  visibility?: PostVisibility;
}
