import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateFacultyDto, UpdateFacultyDto } from './dto/faculty.dto';
import { CreateAcademicProgramDto, UpdateAcademicProgramDto } from './dto/academic-program.dto';
import { JwtGuard, RolesGuard } from '@/common/guard';
import { Roles } from '@/common/decorators';
import { Role } from '@/common/enums/role.enum';

@Controller('university')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  // Faculties (Read: Public | Write: Role.ADMIN Only)

  @Get('faculties')
  async getFaculties() {
    return await this.universityService.getFaculties();
  }

  @Get('faculties/:id')
  async getFacultyById(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.getFacultyById(id);
  }

  @Post('faculties')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createFaculty(@Body() dto: CreateFacultyDto) {
    return await this.universityService.createFaculty(dto);
  }

  @Patch('faculties/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateFaculty(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFacultyDto,
  ) {
    return await this.universityService.updateFaculty(id, dto);
  }

  @Delete('faculties/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteFaculty(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.deleteFaculty(id);
  }

  // Academic programs (Read: Public | Write: Role.ADMIN Only)

  @Get('programs')
  async getAcademicPrograms() {
    return await this.universityService.getAcademicPrograms();
  }

  @Get('programs/:id')
  async getAcademicProgramById(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.getAcademicProgramById(id);
  }

  @Post('programs')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createAcademicProgram(@Body() dto: CreateAcademicProgramDto) {
    return await this.universityService.createAcademicProgram(dto);
  }

  @Patch('programs/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async updateAcademicProgram(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAcademicProgramDto,
  ) {
    return await this.universityService.updateAcademicProgram(id, dto);
  }

  @Delete('programs/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteAcademicProgram(@Param('id', ParseIntPipe) id: number) {
    return await this.universityService.deleteAcademicProgram(id);
  }
}
