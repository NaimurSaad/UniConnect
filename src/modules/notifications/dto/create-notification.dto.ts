import {
  IsUUID,
  IsNotEmpty,
  IsString,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  user_id!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  notification_type!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  related_entity_type?: string;

  @IsOptional()
  @IsUUID()
  related_entity_id?: string;
}

