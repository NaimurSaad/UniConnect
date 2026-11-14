import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity';
import { AcademicProgram } from './entities/academic-program.entity';
import { CreateFacultyDto, UpdateFacultyDto } from './dto/faculty.dto';
import { CreateAcademicProgramDto, UpdateAcademicProgramDto } from './dto/academic-program.dto';

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(Faculty) private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(AcademicProgram) private readonly programRepository: Repository<AcademicProgram>,
  ) {}

  //Faculties

  async getFaculties() {
    try {
      return await this.facultyRepository.find({ relations: ['programs'] });
    } catch (error) {
      throw error;
    }
  }

  async getFacultyById(id: number) {
    try {
      const faculty = await this.facultyRepository.findOne({
        where: { id },
        relations: ['programs'],
      });
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${id} not found`);
      }
      return faculty;
    } catch (error) {
      throw error;
    }
  }

  async createFaculty(dto: CreateFacultyDto) {
    try {
      const existing = await this.facultyRepository.findOne({
        where: [{ name: dto.name }, { code: dto.code }],
      });
      if (existing) {
        throw new ConflictException('Faculty with this name or code already exists');
      }

      const faculty = this.facultyRepository.create(dto);
      return await this.facultyRepository.save(faculty);
    } catch (error) {
      throw error;
    }
  }

  async updateFaculty(id: number, dto: UpdateFacultyDto) {
    try {
      const faculty = await this.facultyRepository.findOne({ where: { id } });
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${id} not found`);
      }

      Object.assign(faculty, dto);
      return await this.facultyRepository.save(faculty);
    } catch (error) {
      throw error;
    }
  }

  async deleteFaculty(id: number) {
    try {
      const faculty = await this.facultyRepository.findOne({ where: { id } });
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${id} not found`);
      }
      return await this.facultyRepository.delete({ id });
    } catch (error) {
      throw error;
    }
  }

  //Academic programs

  async getAcademicPrograms() {
    try {
      return await this.programRepository.find({ relations: ['faculty'] });
    } catch (error) {
      throw error;
    }
  }

  async getAcademicProgramById(id: number) {
    try {
      const program = await this.programRepository.findOne({
        where: { id },
        relations: ['faculty'],
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
      const faculty = await this.facultyRepository.findOne({
        where: { id: dto.facultyId },
      });
      if (!faculty) {
        throw new NotFoundException(`Faculty with ID ${dto.facultyId} not found`);
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

      if (dto.facultyId) {
        const faculty = await this.facultyRepository.findOne({
          where: { id: dto.facultyId },
        });
        if (!faculty) {
          throw new NotFoundException(`Faculty with ID ${dto.facultyId} not found`);
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
