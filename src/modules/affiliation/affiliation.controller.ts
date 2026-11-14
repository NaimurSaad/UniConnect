import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AffiliationService } from './affiliation.service';
import { CreateAlumniAffiliationDto, CreateFacultyAffiliationDto, CreateStudentAffiliationDto, ReviewAffiliationRequestDto } from './dto/affiliation.dto';
import { JwtGuard, RolesGuard } from '@/common/guard';
import { Roles } from '@/common/decorators';
import { Role } from '@/common/enums/role.enum';

@Controller('affiliations')
export class AffiliationController {
    constructor(private readonly affiliationService: AffiliationService) { }

    @Post('student')
    @UseGuards(JwtGuard)
    async submitStudent(@Request() req: any, @Body() dto: CreateStudentAffiliationDto) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        return await this.affiliationService.submitStudentAffiliation(userId, dto);
    }

    @Post('faculty')
    @UseGuards(JwtGuard)
    async submitFaculty(@Request() req: any, @Body() dto: CreateFacultyAffiliationDto) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        return await this.affiliationService.submitFacultyAffiliation(userId, dto);
    }

    @Post('alumni')
    @UseGuards(JwtGuard)
    async submitAlumni(@Request() req: any, @Body() dto: CreateAlumniAffiliationDto) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        return await this.affiliationService.submitAlumniAffiliation(userId, dto);
    }

    @Get('me')
    @UseGuards(JwtGuard)
    async getMyAffiliations(@Request() req: any) {
        const userId = req.user.user_id || req.user.id || req.user.sub;
        return await this.affiliationService.getUserAffiliations(userId);
    }

    @Get('user/:userId')
    async getUserAffiliations(@Param('userId', ParseUUIDPipe) userId: string) {
        return await this.affiliationService.getUserAffiliations(userId);
    }

    @Get('requests/pending')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getPendingRequests() {
        return await this.affiliationService.getPendingRequests();
    }

    @Get('requests')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async getAllRequests() {
        return await this.affiliationService.getAllRequests();
    }

    @Patch('requests/:id/review')
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN)
    async reviewRequest(
        @Request() req: any,
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: ReviewAffiliationRequestDto,
    ) {
        const adminId = req.user.user_id || req.user.id || req.user.sub;
        return await this.affiliationService.reviewRequest(id, adminId, dto);
    }
}