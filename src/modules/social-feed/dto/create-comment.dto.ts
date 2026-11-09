import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @IsString()
  content!: string;

  // Optional author_id for testing before auth guard merge
  @IsOptional()
  @IsString()
  author_id?: string;
}

export class UpdateCommentDto {
  @IsNotEmpty({ message: 'Comment content cannot be empty' })
  @IsString()
  content!: string;
}

