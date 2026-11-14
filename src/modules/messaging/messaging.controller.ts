import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, UnauthorizedException } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { JwtGuard } from '@/common/guard';

@Controller('messaging')
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Post('conversations')
  @UseGuards(JwtGuard)
  async createConversation(@Body() dto: CreateConversationDto, @Req() req: any) {
    const userId = req.user?.user_id;
    if (!userId) throw new UnauthorizedException('User ID not found in token');
    
    return await this.messagingService.createConversation(dto, userId);
  }

  @Get('conversations')
  @UseGuards(JwtGuard)
  async getMyConversations(@Req() req: any) {
    const userId = req.user?.user_id;
    if (!userId) throw new UnauthorizedException('User ID not found in token');
    
    return await this.messagingService.getMyConversations(userId);
  }

  @Post('conversations/:id/messages')
  @UseGuards(JwtGuard)
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
    @Req() req: any,
  ) {
    const userId = req.user?.user_id;
    if (!userId) throw new UnauthorizedException('User ID not found in token');
    
    return await this.messagingService.sendMessage(conversationId, userId, dto);
  }

  @Get('conversations/:id/messages')
  @UseGuards(JwtGuard)
  async getMessages(
    @Param('id') conversationId: string,
    @Req() req: any,
  ) {
    const userId = req.user?.user_id;
    if (!userId) throw new UnauthorizedException('User ID not found in token');
    
    return await this.messagingService.getMessages(conversationId, userId);
  }

  @Patch('messages/:id')
  @UseGuards(JwtGuard)
  async editMessage(
    @Param('id') messageId: string,
    @Body() dto: UpdateMessageDto,
    @Req() req: any,
  ) {
    const userId = req.user?.user_id;
    if (!userId) throw new UnauthorizedException('User ID not found in token');
    
    return await this.messagingService.editMessage(messageId, userId, dto);
  }
  
  @Post('conversations/:id/participants')
  @UseGuards(JwtGuard)
  async addParticipant(
    @Param('id') conversationId: string,
    @Body('userId') userIdToAdd: string,
    @Req() req: any,
  ) {
    const requesterId = req.user?.user_id;
    if (!requesterId) throw new UnauthorizedException('User ID not found');
    
    return await this.messagingService.addParticipant(conversationId, userIdToAdd, requesterId);
  }
  
}