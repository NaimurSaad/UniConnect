import { IsArray, IsOptional, IsString, IsUUID, MaxLength, ValidateNested, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AttachmentMediaType } from '../entities/message-attachment.entity';

export class AttachmentDto {
  @IsEnum(AttachmentMediaType)
  mediaType!: AttachmentMediaType;

  @IsString()
  @MaxLength(500)
  fileUrl!: string;

  @IsString()
  @MaxLength(100)
  mimeType!: string;

  @IsInt()
  @Min(1)
  fileSizeBytes!: number;
}

export class SendMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  content?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];
}