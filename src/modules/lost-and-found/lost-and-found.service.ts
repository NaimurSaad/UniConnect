import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostFoundPost, LostFoundStatus } from './entities/lost-found-post.entity';
import { CreateLostFoundPostDto } from './dto/create-lost-found-post.dto';
import { UpdateLostFoundPostDto } from './dto/update-lost-found-post.dto';

@Injectable()
export class LostAndFoundService {
  constructor(
    @InjectRepository(LostFoundPost)
    private readonly lostFoundRepository: Repository<LostFoundPost>,
  ) {}

  async create(createDto: CreateLostFoundPostDto, userId: string) {
    try {
      const post = this.lostFoundRepository.create({
        ...createDto,
        authorId: userId,
        eventDate: createDto.eventDate ? new Date(createDto.eventDate) : null,
      });
      return await this.lostFoundRepository.save(post);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.lostFoundRepository.find({
        relations: ['author'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const post = await this.lostFoundRepository.findOne({
        where: { id },
        relations: ['author'],
      });
      if (!post) {
        throw new NotFoundException('Lost/Found post not found');
      }
      return post;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateLostFoundPostDto, userId: string) {
    try {
      const post = await this.findOne(id);

      if (post.authorId !== userId) {
        throw new ForbiddenException('You can only update your own post');
      }

      Object.assign(post, updateDto);
      if (updateDto.eventDate) {
        post.eventDate = new Date(updateDto.eventDate);
      }
      
      return await this.lostFoundRepository.save(post);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    try {
      const post = await this.findOne(id);

      if (post.authorId !== userId) {
        throw new ForbiddenException('You can only delete your own post');
      }

      await this.lostFoundRepository.remove(post);
      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}