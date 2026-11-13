import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BloodRequest } from './entities/blood-request.entity';
import { BloodDonationService } from './blood-donation.service';
import { BloodDonationController } from './blood-donation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BloodRequest])],
  controllers: [BloodDonationController],
  providers: [BloodDonationService],
  exports: [BloodDonationService], // অন্য মডিউল থেকে ব্যবহার করার জন্য
})
export class BloodDonationModule {}