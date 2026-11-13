import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodRequest, BloodRequestStatus } from './entities/blood-request.entity';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood-request.dto';

@Injectable()
export class BloodDonationService {
  constructor(
    @InjectRepository(BloodRequest)
    private readonly bloodRequestRepository: Repository<BloodRequest>,
  ) {}

  async create(createDto: CreateBloodRequestDto, userId: string) {
    try {
      const request = this.bloodRequestRepository.create({
        ...createDto,
        requesterId: userId,
        neededBy: new Date(createDto.neededBy),
      });
      return await this.bloodRequestRepository.save(request);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.bloodRequestRepository.find({
        where: { status: BloodRequestStatus.OPEN },
        relations: ['requester'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const request = await this.bloodRequestRepository.findOne({
        where: { id },
        relations: ['requester'],
      });
      if (!request) {
        throw new NotFoundException('Blood request not found');
      }
      return request;
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateDto: UpdateBloodRequestDto, userId: string) {
    try {
      const request = await this.findOne(id);

      if (request.requesterId !== userId) {
        throw new ForbiddenException('You can only update your own request');
      }

      Object.assign(request, updateDto);
      if (updateDto.neededBy) {
        request.neededBy = new Date(updateDto.neededBy);
      }
      return await this.bloodRequestRepository.save(request);
    } catch (error) {
      throw error;
    }
  }
}