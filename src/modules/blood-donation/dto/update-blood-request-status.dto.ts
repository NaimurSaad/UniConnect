import { IsEnum, IsNotEmpty } from 'class-validator';
import { BloodRequestStatus } from '../entities/blood-request.entity';

export class UpdateBloodRequestStatusDto {
  @IsEnum(BloodRequestStatus)
  @IsNotEmpty()
  status!: BloodRequestStatus;
}