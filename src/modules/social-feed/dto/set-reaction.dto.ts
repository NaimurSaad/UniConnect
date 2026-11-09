import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReactionType } from '../enums/social-feed.enums';

export class SetReactionDto {
  @IsEnum(ReactionType, {
    message: 'reaction_type must be one of: like, love, support, insightful',
  })
  reaction_type: ReactionType;

  // Optional user_id for testing before auth guard merge
  @IsOptional()
  @IsString()
  user_id?: string;
}

