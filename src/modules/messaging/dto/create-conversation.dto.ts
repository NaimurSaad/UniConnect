import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ConversationType } from '../entities/conversation.entity';

export class CreateConversationDto {
  @IsEnum(ConversationType, { message: 'conversationType must be direct or group' })
  @IsNotEmpty()
  conversationType!: ConversationType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsArray()
  @IsUUID('4', { each: true, message: 'Each participant ID must be a valid UUID' })
  participantIds!: string[];
}