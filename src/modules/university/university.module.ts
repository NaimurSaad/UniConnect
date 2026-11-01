import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { AcademicProgram } from './entities/academic-program.entity';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, AcademicProgram])],
  controllers: [UniversityController],
  providers: [UniversityService],
  exports: [UniversityService, TypeOrmModule],
})
export class UniversityModule {}
