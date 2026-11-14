import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { BloodDonationService } from './blood-donation.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood-request.dto';
import { JwtGuard } from '@/common/guard'; 

@Controller('blood-donation')
export class BloodDonationController {
  constructor(private readonly bloodDonationService: BloodDonationService) {}

  @Post('requests')
  @UseGuards(JwtGuard)
  async create(@Body() createDto: CreateBloodRequestDto, @Req() req: any) {

    const userId = req.user?.user_id; 
    
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return await this.bloodDonationService.create(createDto, userId);
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
  async update(@Param('id') id: string, @Body() updateDto: UpdateBloodRequestDto, @Req() req: any) {
    const userId = req.user?.user_id;
    
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }

    return await this.bloodDonationService.update(id, updateDto, userId);
  }
}