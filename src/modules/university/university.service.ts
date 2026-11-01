import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { AcademicProgram } from './entities/academic-program.entity';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { CreateAcademicProgramDto, UpdateAcademicProgramDto } from './dto/academic-program.dto';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(Department) private readonly departmentRepository: Repository<Department>,
    @InjectRepository(AcademicProgram) private readonly programRepository: Repository<AcademicProgram>,
  ) {}

  //Departments

  async getDepartments() {
    try {
      return await this.departmentRepository.find({ relations: ['programs'] });
    } catch (error) {
      throw error;
    }
  }

  async getDepartmentById(id: number) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id },
        relations: ['programs'],
      });
      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      return department;
    } catch (error) {
      throw error;
    }
  }

  async createDepartment(dto: CreateDepartmentDto) {
    try {
      const existing = await this.departmentRepository.findOne({
        where: [{ name: dto.name }, { code: dto.code }],
      });
      if (existing) {
        throw new ConflictException('Department with this name or code already exists');
      }

      const department = this.departmentRepository.create(dto);
      return await this.departmentRepository.save(department);
    } catch (error) {
      throw error;
    }
  }

  async updateDepartment(id: number, dto: UpdateDepartmentDto) {
    try {
      const department = await this.departmentRepository.findOne({ where: { id } });
      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }

      Object.assign(department, dto);
      return await this.departmentRepository.save(department);
    } catch (error) {
      throw error;
    }
  }

  async deleteDepartment(id: number) {
    try {
      const department = await this.departmentRepository.findOne({ where: { id } });
      if (!department) {
        throw new NotFoundException(`Department with ID ${id} not found`);
      }
      return await this.departmentRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }

  // Academic programs

  async getAcademicPrograms() {
    try {
      return await this.programRepository.find({ relations: ['department'] });
    } catch (error) {
      throw error;
    }
  }

  async getAcademicProgramById(id: number) {
    try {
      const program = await this.programRepository.findOne({
        where: { id },
        relations: ['department'],
      });
      if (!program) {
        throw new NotFoundException(`Academic program with ID ${id} not found`);
      }
      return program;
    } catch (error) {
      throw error;
    }
  }

  async createAcademicProgram(dto: CreateAcademicProgramDto) {
    try {
      const department = await this.departmentRepository.findOne({
        where: { id: dto.departmentId },
      });
      if (!department) {
        throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);
      }

      const program = this.programRepository.create(dto);
      return await this.programRepository.save(program);
    } catch (error) {
      throw error;
    }
  }

  async updateAcademicProgram(id: number, dto: UpdateAcademicProgramDto) {
    try {
      const program = await this.programRepository.findOne({ where: { id } });
      if (!program) {
        throw new NotFoundException(`Academic program with ID ${id} not found`);
      }

      if (dto.departmentId) {
        const department = await this.departmentRepository.findOne({
          where: { id: dto.departmentId },
        });
        if (!department) {
          throw new NotFoundException(`Department with ID ${dto.departmentId} not found`);
        }
      }

      Object.assign(program, dto);
      return await this.programRepository.save(program);
    } catch (error) {
      throw error;
    }
  }

  async deleteAcademicProgram(id: number) {
    try {
      const program = await this.programRepository.findOne({ where: { id } });
      if (!program) {
        throw new NotFoundException(`Academic program with ID ${id} not found`);
      }
      return await this.programRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }
}
