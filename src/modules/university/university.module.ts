import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entities/faculty.entity';
import { AcademicProgram } from './entities/academic-program.entity';
import { UniversityController } from './university.controller';
import { UniversityService } from './university.service';

@Module({
  imports: [TypeOrmModule.forFeature([Faculty, AcademicProgram])],
  controllers: [UniversityController],
  providers: [UniversityService],
  exports: [UniversityService, TypeOrmModule],
})
export class UniversityModule {}
