import { IsEnum, IsNotEmpty } from 'class-validator';
import { BloodResponseStatus } from '../entities/blood-response.entity';

export class UpdateBloodResponseStatusDto {
  @IsEnum(BloodResponseStatus)
  @IsNotEmpty()
  status!: BloodResponseStatus;
}