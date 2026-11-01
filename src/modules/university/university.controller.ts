import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { CreateAcademicProgramDto, UpdateAcademicProgramDto } from './dto/academic-program.dto';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  // Departments

  @Get('departments')
  async getDepartments() {
    return await this.universityService.getDepartments();
  }

  @Get('departments/:id')
  async getDepartmentById(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.getDepartmentById(id);
  }

  @Post('departments')
  async createDepartment(@Body() dto: CreateDepartmentDto) {
    return await this.universityService.createDepartment(dto);
  }

  @Patch('departments/:id')
  async updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
  ) {
    return await this.universityService.updateDepartment(id, dto);
  }

  @Delete('departments/:id')
  async deleteDepartment(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.deleteDepartment(id);
  }

  // Academic programs

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
