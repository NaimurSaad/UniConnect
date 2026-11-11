import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'author_id is required' })
  @IsUUID('all', { message: 'author_id must be a valid UUID' })
  author_id!: string;

  @IsNotEmpty({ message: 'content cannot be empty' })
  @IsString({ message: 'content must be a string' })
  @MaxLength(1000, { message: 'content cannot exceed 1000 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  content!: string;
}
