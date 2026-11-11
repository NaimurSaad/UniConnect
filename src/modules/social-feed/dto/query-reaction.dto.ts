import { IsEnum, IsOptional } from 'class-validator';
import { ReactionType } from '../enums/social-feed.enums';

export class QueryReactionDto {
  @IsOptional()
  @IsEnum(ReactionType, {
    message: 'type must be one of: like, love, support, insightful',
  })
  type?: ReactionType;
}

