import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, Query } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { CreateJobDto, UpdateJobDto, ApplyJobDto, UpdateApplicationDto } from "./dto/job.dto";
import { JwtGuard } from "../../common/guard/jwt.guard";

@Controller("jobs")
@UseGuards(JwtGuard)
export class JobsController {

    constructor(private readonly jobsService: JobsService) {}

    @Get()
    async getJobs(
        @Query("search") search?: string,
        @Query("type") type?: string,
        @Query("status") status?: string
    ) {
        return await this.jobsService.getJobs(search, type, status);
    }

    @Post()
        async createJob(@Req() req: any, @Body(ValidationPipe) dto: CreateJobDto) {
            return await this.jobsService.createJob(req.user.id, dto);
    }
    
    @Patch(":id")
        async updateJob(@Param("id") id: string, @Req() req: any, @Body() dto: UpdateJobDto) {    
            return await this.jobsService.updateJob(id, req.user.id, dto);
    }

    @Delete(":id")
        async deleteJob(@Param("id") id: string, @Req() req: any) {
            return await this.jobsService.deleteJob(id, req.user.id);
    }

    @Post(":id/apply")
        async applyJob(@Param("id") id: string, @Req() req: any, @Body(ValidationPipe) dto: ApplyJobDto) {
            return await this.jobsService.applyJob(id, req.user.id, dto);
    }

    @Get("applications/me")
        async getMyApplications(@Req() req: any) {
            return await this.jobsService.getMyApplications(req.user.id);
    }

    @Get(":id/applications")
        async getApplicationsForJob(@Param("id") id: string, @Req() req: any) {
            return await this.jobsService.getApplicationsForJob(id, req.user.id);
    }

    @Patch(":id/applications/:appId")
        async updateApplicationStatus(@Param("id") id: string, @Param("appId") appId: string, @Req() req: any, @Body(ValidationPipe) dto: UpdateApplicationDto) {
            return await this.jobsService.updateApplicationStatus(id, appId, req.user.id, dto);
    }

    @Patch("applications/:id/withdraw")
        async withdrawApplication(@Param("id") id: string, @Req() req: any) {
            return await this.jobsService.withdrawApplication(id, req.user.id);
    }
}