import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JobPost, JobStatus } from "./entities/job-post.entity";
import { JobApplication, ApplicationStatus } from "./entities/job-application.entity";
import { CreateJobDto } from "./dto/create-job.dto";
import { UpdateJobDto } from "./dto/update-job.dto";
import { ApplyJobDto } from "./dto/apply-job.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";

@Injectable()
export class JobsService {
constructor(
  @InjectRepository(JobPost) private readonly jobPostRepository: Repository<JobPost>,
  @InjectRepository(JobApplication) private readonly applicationRepository: Repository<JobApplication>,
) {}

async getJobs(search?: string, type?: string, status: any = "open") {
try {
  const qb = this.jobPostRepository.createQueryBuilder("jp").leftJoinAndSelect("jp.author", "author");

  if (status) qb.andWhere("jp.status = :status", { status });
  if (type) qb.andWhere("jp.job_type = :type", { type });
  if (search) qb.andWhere("(jp.title ILIKE :s OR jp.organization ILIKE :s)", { s: `%${search}%` });

  qb.orderBy("jp.created_at", "DESC");
  const jobs = await qb.getMany();
  return jobs;}
  catch (error) {
    throw error;
}
}

async createJob(userId: string, dto: CreateJobDto) {
try{
  if (dto.deadline && new Date(dto.deadline).getTime() < Date.now()) {
    throw new BadRequestException("Deadline must be in the future");
  }
  const responce = await this.jobPostRepository.create({
    ...dto,
    authorId: userId,
    deadline: dto.deadline ? new Date(dto.deadline) : null,
  });
  return await this.jobPostRepository.save(responce);
}
catch (error) {
  throw error;
}}

async getMyApplications(userId: string) {
try {
  const apps = await this.applicationRepository.find({
    where: { applicantId: userId },
    relations: ["jobPost"],
  });
  return apps;}
  catch (error) {
    throw error;
}
}

async getJobById(id: string) {
try {
  const post = await this.jobPostRepository.findOne({
    where: { id:id },
    relations: ["author"],
  });
  if (!post) throw new NotFoundException("Job post not found");
  return post;
}
catch (error) {
  throw error;
}
}

async updateJob(id: string, userId: string, dto: UpdateJobDto) {
  try{
    console.log("id",id);
    if (!id) {
      throw new NotFoundException("Job with ID not found");
    }
    const post = await this.getJobById(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException("You can only update your own listings");
    }
    
    Object.assign(post, dto);
    if (dto.deadline) post.deadline = new Date(dto.deadline);
    
    const {id: jobId, ...rest}=post;
    return await this.jobPostRepository.update({id:id}, rest);
  } 
  catch(error){
    throw error;
  }
}

async deleteJob(id: string, userId: string) {
  try{
  const post = await this.getJobById(id);
  if (post.authorId !== userId) {
    throw new ForbiddenException("You can only delete your own listings");
  }
  return await this.jobPostRepository.delete({id:id});
  }
  catch(error){
    throw error;
  }
}

async applyJob(id: string, userId: string, dto: ApplyJobDto) {
  try{
    const post = await this.getJobById(id);
    if (post.authorId === userId) {
      throw new ForbiddenException("You cannot apply to your own listing");
    }
    if (post.status !== JobStatus.OPEN) {
      throw new BadRequestException("This listing is not open");
    }
    
    const existing = await this.applicationRepository.findOne({
      where: { jobPostId: id, applicantId: userId },
    });
    if (existing) throw new ConflictException("You have already applied to this listing");

    const responce = this.applicationRepository.create({
      ...dto,
      jobPostId: id,
      applicantId: userId,
    });
    return await this.applicationRepository.save(responce);
  }
  catch(error){
    throw error;
  }
}

async getApplicationsForJob(id: string, userId: string) {
  try{
    const post = await this.getJobById(id);
    if (post.authorId !== userId) {
      throw new ForbiddenException("Only the listing owner can view applications");
    }
    const apps = await this.applicationRepository.find({
      where: { jobPostId: id },
      relations: ["applicant"],
    });
    return apps;
  }
  catch(error){
    throw error;
  }
}

async updateApplicationStatus(id: string, applicationId: string, userId: string, dto: UpdateApplicationDto) {
  try{
    const post = await this.getJobById(id);
    if (post.authorId !== userId) throw new ForbiddenException("Not allowed");

    const app = await this.applicationRepository.findOne({
      where: { id: applicationId, jobPostId: id },
    });
    if (!app) throw new NotFoundException("Application not found");

    app.status = dto.status;

    if (dto.status === ApplicationStatus.ACCEPTED) {
      post.status = JobStatus.CLOSED;
      await this.jobPostRepository.save(post);
    }
    return await this.applicationRepository.save(app);
  }
  catch(error){
    throw error;
  }
}

async withdrawApplication(id: string, userId: string) {
  try{
    const app = await this.applicationRepository.findOne({
      where: { id, applicantId: userId },
    });
    if (!app) throw new NotFoundException("Application not found");
    
    app.status = ApplicationStatus.WITHDRAWN;
    return await this.applicationRepository.save(app);
  }
  catch(error){
    throw error;
  }
}

}