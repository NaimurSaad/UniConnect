import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood-request.entity';
import { BloodDonationService } from './blood-donation.service';
import { BloodDonationController } from './blood-donation.controller';
import { BloodResponse } from './entities/blood-response.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BloodRequest, BloodResponse])],
  controllers: [BloodDonationController],
  providers: [BloodDonationService],
  exports: [BloodDonationService],
})
export class BloodDonationModule {}