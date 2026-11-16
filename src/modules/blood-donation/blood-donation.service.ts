import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BloodRequest, BloodRequestStatus } from './entities/blood-request.entity';
import { CreateBloodRequestDto } from './dto/create-blood-request.dto';
import { UpdateBloodRequestDto } from './dto/update-blood-request.dto';
import { BloodResponse, BloodResponseStatus } from './entities/blood-response.entity';
import { RespondBloodRequestDto } from './dto/respond-blood-request.dto';
import { UpdateBloodResponseStatusDto } from './dto/update-blood-response-status.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class BloodDonationService {
  constructor(
    @InjectRepository(BloodRequest)
    private readonly bloodRequestRepository: Repository<BloodRequest>,
    @InjectRepository(BloodResponse)
    private readonly bloodResponseRepository: Repository<BloodResponse>,
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
  
  async respondToRequest(requestId: string, donorId: string, dto: RespondBloodRequestDto) {
    try {
      const request = await this.findOne(requestId);
      
      if (request.requesterId === donorId) {
        throw new BadRequestException('You cannot respond to your own request');
      }

      if (request.status !== BloodRequestStatus.OPEN) {
        throw new BadRequestException('This request is no longer open');
      }

      const existingResponse = await this.bloodResponseRepository.findOne({
        where: { requestId, donorId }
      });

      if (existingResponse) {
        throw new BadRequestException('You have already responded to this request');
      }

      const response = this.bloodResponseRepository.create({
        requestId,
        donorId,
        message: dto.message,
      });

      return await this.bloodResponseRepository.save(response);
    } catch (error) {
      throw error;
    }
  }

  async getResponsesForRequest(requestId: string) {
    return await this.bloodResponseRepository.find({
      where: { requestId },
      relations: ['donor'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateResponseStatus(responseId: string, userId: string, dto: UpdateBloodResponseStatusDto) {
    const response = await this.bloodResponseRepository.findOne({ where: { id: responseId }, relations: ['request'] });
    
    if (!response) {
      throw new NotFoundException('Blood response not found');
    }

    if (dto.status === BloodResponseStatus.WITHDRAWN) {
       if (response.donorId !== userId) {
         throw new BadRequestException('Only the donor can withdraw');
       }
    } else {
       if (response.request.requesterId !== userId) {
         throw new BadRequestException('Only the requester can accept or decline');
       }
    }

    response.status = dto.status;
    return await this.bloodResponseRepository.save(response);
  }
}