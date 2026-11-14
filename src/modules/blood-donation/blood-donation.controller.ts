import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { BloodDonationService } from './blood-donation.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood-request.dto';
import { JwtGuard } from '@/common/guard';

@Controller('blood-donation')
export class BloodDonationController {
  constructor(private readonly bloodDonationService: BloodDonationService) {}

  @Post('requests')
  @UseGuards(JwtGuard)
  async create(@Body() createDto: CreateBloodRequestDto) {
    
    const dummyUserId = '509ba906-4884-4297-8ddd-78cb178ce806'
    return await this.bloodDonationService.create(createDto, dummyUserId);
  }

  @Get('requests')
  async findAll() {
    return await this.bloodDonationService.findAll();
  }

  @Get('requests/:id')
  async findOne(@Param('id') id: string) {
    return await this.bloodDonationService.findOne(id);
  }

  @Patch('requests/:id')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateBloodRequestDto) {
    const dummyUserId = '123e4567-e89b-12d3-a456-426614174000';
    return await this.bloodDonationService.update(id, updateDto, dummyUserId);
  }
}