import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { BloodDonationService } from './blood-donation.service';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood-request.dto';
import { RespondBloodRequestDto } from './dto/respond-blood-request.dto';
import { UpdateBloodResponseStatusDto } from './dto/update-blood-response-status.dto';

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

  @Post('requests/:id/respond')
  @UseGuards(JwtGuard)
  async respond(
    @Param('id') requestId: string,
    @Body() dto: RespondBloodRequestDto,
    @Req() req: any
  ) {
    const userId = req.user?.user_id;
    if (!userId) throw new UnauthorizedException('User ID not found');
    
    return await this.bloodDonationService.respondToRequest(requestId, userId, dto);
  }

  @Get('requests/:id/responses')
  async getResponses(@Param('id') requestId: string) {
    return await this.bloodDonationService.getResponsesForRequest(requestId);
  }

  @Patch('responses/:id/status')
  @UseGuards(JwtGuard)
  async updateResponseStatus(
    @Param('id') responseId: string,
    @Body() dto: UpdateBloodResponseStatusDto,
    @Req() req: any
  ) {
    const userId = req.user?.user_id;
    if (!userId) throw new UnauthorizedException('User ID not found');
    
    return await this.bloodDonationService.updateResponseStatus(responseId, userId, dto);
  }
}