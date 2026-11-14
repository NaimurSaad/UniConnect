import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto, UpdateUserDto, UpdateUserProfileDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserProfile) private readonly profileRepository: Repository<UserProfile>,
  ) { }

  async getUsers() {
    try {
      const users = await this.userRepository.find({ relations: ['profile'] });
      return users.map(({ passwordHash, ...user }) => user);
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id }, relations: ['profile'] });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const { passwordHash, ...sanitized } = user;
      return sanitized;
    } catch (error) {
      throw error;
    }
  }

  async createUser(dto: CreateUserDto) {
    try {
      const existing = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('Email already registered');
      }

      const passwordHash = await argon2.hash(dto.password);
      const user = this.userRepository.create({
        fullName: dto.fullName,
        email: dto.email,
        passwordHash,
        accountStatus: dto.accountStatus,
        role: dto.role,
        profile: this.profileRepository.create(),
      });

      const saved = await this.userRepository.save(user);
      const { passwordHash: _, ...sanitized } = saved;
      return sanitized;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    try {
      if (!id) {
        throw new NotFoundException('User ID is required');
      }
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      if (dto.email && dto.email !== user.email) {
        const emailTaken = await this.userRepository.findOne({ where: { email: dto.email } });
        if (emailTaken) {
          throw new ConflictException('Email already registered');
        }
        user.email = dto.email;
      }

      if (dto.password) {
        user.passwordHash = await argon2.hash(dto.password);
      }
      if (dto.fullName) user.fullName = dto.fullName;
      if (dto.accountStatus) user.accountStatus = dto.accountStatus;
      if (dto.role) user.role = dto.role;

      const saved = await this.userRepository.save(user);
      const { passwordHash, ...sanitized } = saved;
      return sanitized;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(userId: string, dto: UpdateUserProfileDto) {
    try {
      let profile = await this.profileRepository.findOne({ where: { userId } });
      if (!profile) {
        profile = this.profileRepository.create({ userId, ...dto });
      } else {
        Object.assign(profile, dto);
      }
      return await this.profileRepository.save(profile);
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      await this.userRepository.delete(id);
      return { message: `User with ID ${id} successfully deleted` };
    } catch (error) {
      throw error;
    }
  }

  async findOneByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });
      return user;
    } catch (error) {
      throw error;
    }
  }
}