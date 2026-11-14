import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Conversation, ConversationType } from './entities/conversation.entity';
import { ConversationParticipant } from './entities/conversation-participant.entity';
import { Message } from './entities/message.entity';
import { MessageAttachment } from './entities/message-attachment.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';


@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationParticipant)
    private readonly participantRepository: Repository<ConversationParticipant>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(MessageAttachment)
    private readonly attachmentRepository: Repository<MessageAttachment>,
  ) {}

  async createConversation(dto: CreateConversationDto, creatorId: string) {
    if (dto.conversationType === ConversationType.DIRECT && dto.participantIds.length !== 1) {
      throw new BadRequestException('Direct conversation must have exactly 2 participants (you + 1)');
    }

    const conversation = this.conversationRepository.create({
      conversationType: dto.conversationType,
      title: dto.title,
      createdBy: creatorId,
    });
    const savedConversation = await this.conversationRepository.save(conversation);

    const participants = [creatorId, ...dto.participantIds].map((userId) =>
      this.participantRepository.create({
        conversationId: savedConversation.id,
        userId,
      }),
    );
    await this.participantRepository.save(participants);

    return savedConversation;
  }

  async getMyConversations(userId: string) {
    const participations = await this.participantRepository.find({
      where: { userId },
      relations: ['conversation'],
    });
    return participations.map((p) => p.conversation);
  }

  async sendMessage(conversationId: string, senderId: string, dto: SendMessageDto) {

    const isParticipant = await this.participantRepository.findOne({
      where: { conversationId, userId: senderId },
    });
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    if (!dto.content && (!dto.attachments || dto.attachments.length === 0)) {
      throw new BadRequestException('Message must contain text or at least one attachment');
    }

    const message = this.messageRepository.create({
      conversationId,
      senderId,
      content: dto.content || null,
    });
    const savedMessage = await this.messageRepository.save(message);

    if (dto.attachments && dto.attachments.length > 0) {
      const attachments = dto.attachments.map((att) =>
        this.attachmentRepository.create({
          messageId: savedMessage.id,
          mediaType: att.mediaType,
          fileUrl: att.fileUrl,
          mimeType: att.mimeType,
          fileSizeBytes: att.fileSizeBytes,
        }),
      );
      await this.attachmentRepository.save(attachments);
    }

    return this.messageRepository.findOne({
      where: { id: savedMessage.id },
      relations: ['attachments'],
    });
  }

  async getMessages(conversationId: string, userId: string) {
    const isParticipant = await this.participantRepository.findOne({
      where: { conversationId, userId },
    });
    if (!isParticipant) {
      throw new ForbiddenException('You are not a participant in this conversation');
    }

    return this.messageRepository.find({
      where: { conversationId, deletedAt: IsNull() },
      relations: ['sender', 'attachments'],
      order: { createdAt: 'ASC' },
    });
  }

  async editMessage(messageId: string, userId: string, dto: UpdateMessageDto) {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });
    if (!message) throw new NotFoundException('Message not found');
    
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    message.content = dto.content;
    message.editedAt = new Date();
    return await this.messageRepository.save(message);
  }

    async addParticipant(conversationId: string, userIdToAdd: string, requesterId: string) {
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) throw new NotFoundException('Conversation not found');

    const requester = await this.participantRepository.findOne({ where: { conversationId, userId: requesterId } });
    if (!requester) throw new ForbiddenException('You are not a participant in this conversation');

    const existing = await this.participantRepository.findOne({ where: { conversationId, userId: userIdToAdd } });
    if (existing) throw new BadRequestException('User is already in this conversation');

    const newParticipant = this.participantRepository.create({
      conversationId,
      userId: userIdToAdd,
    });
    await this.participantRepository.save(newParticipant);
    
    return { message: 'Participant added successfully' };
  }
}