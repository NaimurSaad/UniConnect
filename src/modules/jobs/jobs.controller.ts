import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../../common/guard/jwt.guard";
import { JobsService } from "./jobs.service";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { ApplyJobDto } from "./dto/apply-job.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Controller("jobs") 
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async createJob(@Req() req: any, @Body() dto: CreateJobDto) {
    return await this.jobsService.create(req.user.id, dto);
  }

  @Get()
  async getJobs(
    @Query("search") search?: string,
    @Query("type") type?: string,
    @Query("status") status?: any,
  ) {
    return await this.jobsService.findAll(search, type, status || "open");
  }

  @Get("applications/me")
  async getMyApplications(@Req() req: any) {
    return await this.jobsService.myApplications(req.user.id);
  }

  @Get(":id")
  async getJobById(@Param("id", ParseUUIDPipe) id: string) {
    return await this.jobsService.findOne(id);
  }

  @Patch(":id")
  async updateJob(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: any,
    @Body() dto: UpdateJobDto,
  ) {
    return await this.jobsService.update(id, req.user.id, dto);
  }

  @Delete(":id")
  async deleteJob(@Param("id", ParseUUIDPipe) id: string, @Req() req: any) {
    return await this.jobsService.remove(id, req.user.id);
  }

  @Post(":id/apply")
  async applyForJob(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: any,
    @Body() dto: ApplyJobDto,
  ) {
    return await this.jobsService.apply(id, req.user.id, dto);
  }

  @Get(":id/applications")
  async getApplicationsForJob(
    @Param("id", ParseUUIDPipe) id: string,
    @Req() req: any,
  ) {
    return await this.jobsService.applicationsForJob(id, req.user.id);
  }

  @Patch(":id/applications/:applicationId")
  async updateApplicationStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Param("applicationId", ParseUUIDPipe) applicationId: string,
    @Req() req: any,
    @Body() dto: UpdateApplicationDto,
  ) {
    return await this.jobsService.updateApplication(id, applicationId, req.user.id, dto);
  }

  @Patch("applications/:applicationId/withdraw")
  async withdrawApplication(
    @Param("applicationId", ParseUUIDPipe) applicationId: string,
    @Req() req: any,
  ) {
    return await this.jobsService.withdrawApplication(applicationId, req.user.id);
  }
}