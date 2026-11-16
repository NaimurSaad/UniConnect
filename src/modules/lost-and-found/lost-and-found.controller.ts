import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { LostAndFoundService } from './lost-and-found.service';
import { CreateLostFoundPostDto } from './dto/create-lost-found-post.dto';
import { UpdateLostFoundPostDto } from './dto/update-lost-found-post.dto';
import { JwtGuard } from '@/common/guard';

@Controller('lost-and-found')
export class LostAndFoundController {
  constructor(private readonly lostAndFoundService: LostAndFoundService) {}

  @Post('posts')
  @UseGuards(JwtGuard)
  async create(@Body() createDto: CreateLostFoundPostDto, @Req() req: any) {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return await this.lostAndFoundService.create(createDto, userId);
  }

  @Get('posts')
  async findAll() {
    return await this.lostAndFoundService.findAll();
  }

  @Get('posts/:id')
  async findOne(@Param('id') id: string) {
    return await this.lostAndFoundService.findOne(id);
  }

  @Patch('posts/:id')
  @UseGuards(JwtGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateLostFoundPostDto, @Req() req: any) {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return await this.lostAndFoundService.update(id, updateDto, userId);
  }

  @Delete('posts/:id')
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.user_id;
    if (!userId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return await this.lostAndFoundService.remove(id, userId);
  }
}