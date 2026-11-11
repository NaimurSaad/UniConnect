import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCommentDto {
  @IsNotEmpty({ message: 'content cannot be empty' })
  @IsString({ message: 'content must be a string' })
  @MaxLength(1000, { message: 'content cannot exceed 1000 characters' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  content!: string;
}

