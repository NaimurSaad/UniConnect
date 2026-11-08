import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateFacultyDto, UpdateFacultyDto } from './dto/faculty.dto';
import { CreateAcademicProgramDto, UpdateAcademicProgramDto } from './dto/academic-program.dto';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  //Faculties

  @Get('faculties')
  async getFaculties() {
    return await this.universityService.getFaculties();
  }

  @Get('faculties/:id')
  async getFacultyById(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.getFacultyById(id);
  }

  @Post('faculties')
  async createFaculty(@Body() dto: CreateFacultyDto) {
    return await this.universityService.createFaculty(dto);
  }

  @Patch('faculties/:id')
  async updateFaculty(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFacultyDto,
  ) {
    return await this.universityService.updateFaculty(id, dto);
  }

  @Delete('faculties/:id')
  async deleteFaculty(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.deleteFaculty(id);
  }

  //Academic programs

  @Get('programs')
  async getAcademicPrograms() {
    return await this.universityService.getAcademicPrograms();
  }

  @Get('programs/:id')
  async getAcademicProgramById(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.getAcademicProgramById(id);
  }

  @Post('programs')
  async createAcademicProgram(@Body() dto: CreateAcademicProgramDto) {
    return await this.universityService.createAcademicProgram(dto);
  }

  @Patch('programs/:id')
  async updateAcademicProgram(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAcademicProgramDto,
  ) {
    return await this.universityService.updateAcademicProgram(id, dto);
  }

  @Delete('programs/:id')
  async deleteAcademicProgram(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.deleteAcademicProgram(id);
  }
}
