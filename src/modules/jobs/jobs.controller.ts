import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, Query, ParseUUIDPipe } from "@nestjs/common";
import { JobsService } from "./jobs.service";
import { CreateJobDto, UpdateJobDto, ApplyJobDto, UpdateApplicationDto } from "./dto/job.dto";
import { JwtGuard } from "../../common/guard/jwt.guard";

@Controller("jobs")
@UseGuards(JwtGuard)
export class JobsController {
    constructor(private readonly jobsService: JobsService) {}

    @Post()
    async createJob(@Req() req: any, @Body(ValidationPipe) dto: CreateJobDto) {
        return await this.jobsService.createJob(req.user.user_id, dto);
    }

    @Get()
    async getJobs(
        @Query("search") search?: string,
        @Query("type") type?: string,
        @Query("status") status?: string
    ) {
        return await this.jobsService.getJobs(search, type, status);
    }

   
    @Get("applications/me")
    async getMyApplications(@Req() req: any) {
        return await this.jobsService.getMyApplications(req.user.user_id);
    }

    
    @Get(":id")
    async getJobById(@Param("id", ParseUUIDPipe) id: string) {
        return await this.jobsService.getJobById(id);
    }
    
    @Patch(":id")
    async updateJob(@Param("id", ParseUUIDPipe) id: string, @Req() req: any, @Body() dto: UpdateJobDto) {    
        return await this.jobsService.updateJob(id, req.user.user_id, dto);
    }

    @Delete(":id")
    async deleteJob(@Param("id", ParseUUIDPipe) id: string, @Req() req: any) {
        return await this.jobsService.deleteJob(id, req.user.user_id);
    }

    @Post(":id/apply")
    async applyJob(@Param("id", ParseUUIDPipe) id: string, @Req() req: any, @Body(ValidationPipe) dto: ApplyJobDto) {
        return await this.jobsService.applyJob(id, req.user.user_id, dto);
    }

    @Get(":id/applications")
    async getApplicationsForJob(@Param("id", ParseUUIDPipe) id: string, @Req() req: any) {
        return await this.jobsService.getApplicationsForJob(id, req.user.user_id);
    }

    @Patch(":id/applications/:appId")
    async updateApplicationStatus(@Param("id", ParseUUIDPipe) id: string, @Param("appId", ParseUUIDPipe) appId: string, @Req() req: any, @Body(ValidationPipe) dto: UpdateApplicationDto) {
        return await this.jobsService.updateApplicationStatus(id, appId, req.user.user_id, dto);
    }

    @Patch("applications/:id/withdraw")
    async withdrawApplication(@Param("id", ParseUUIDPipe) id: string, @Req() req: any) {
        return await this.jobsService.withdrawApplication(id, req.user.user_id);
    }
}
