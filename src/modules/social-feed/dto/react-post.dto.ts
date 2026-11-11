import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ReactionType } from '../enums/social-feed.enums';

export class ReactPostDto {
  @IsNotEmpty({ message: 'user_id is required' })
  @IsUUID('all', { message: 'user_id must be a valid UUID' })
  user_id!: string;

  @IsNotEmpty({ message: 'reaction_type is required' })
  @IsEnum(ReactionType, {
    message: 'reaction_type must be one of: like, love, support, insightful',
  })
  reaction_type!: ReactionType;
}

