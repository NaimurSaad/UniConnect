import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AssignRoleDto, CreateUserDto, UpdateUserDto, UpdateUserProfileDto } from './dto/user.dto';
import { JwtGuard, RolesGuard } from '@/common/guard';
import { Roles } from '@/common/decorators';
import { Role } from '@/common/enums/role.enum';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(JwtGuard)
  async getUsers() {
    return await this.userService.getUsers();
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.createUser(dto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return await this.userService.updateUser(id, dto);
  }

  @Patch(':id/profile')
  @UseGuards(JwtGuard)
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateUserProfileDto) {
    return await this.userService.updateProfile(id, dto);
  }

  @Patch(':id/role')
  @UseGuards(JwtGuard)
  async assignRole(
    @Request() req: any,
    @Param('id') targetUserId: string,
    @Body() dto: AssignRoleDto,
  ) {
    const actorRole = req.user.role as Role;
    return await this.userService.assignRole(actorRole, targetUserId, dto.role);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return await this.userService.deleteUser(id);
  }
}