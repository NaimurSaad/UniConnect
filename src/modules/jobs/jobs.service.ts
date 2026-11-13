import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JobPost, JobStatus } from "./entities/job-post.entity";
import { JobApplication, ApplicationStatus } from "./entities/job-application.entity";
import { CreateJobDto, UpdateJobDto, ApplyJobDto, UpdateApplicationDto } from "./dto/job.dto";

@Injectable()
export class JobsService {
constructor
(@InjectRepository(JobPost)
private readonly jobRepository: Repository<JobPost>,
@InjectRepository(JobApplication)
private readonly appRepository: Repository<JobApplication>,
){}

async getJobs(search?: string, type?: string, status: string = "open"){
    try{
        const qb = this.jobRepository.createQueryBuilder("job").leftJoinAndSelect("job.author", "author");
        if(search) qb.andWhere("(job.title ILIKE :s OR job.organization ILIKE :s)", { s: `%${search}%` });
        if(type) qb.andWhere("job.jobType = :type", { type });
        if(status) qb.andWhere("job.status = :status", { status });
        
        qb.orderBy("job.created_at", "DESC");
        const jobs = await qb.getMany();
        return jobs;
    }
    catch (error){
        throw error;
    }
}

async createJob(userId: string, dto: CreateJobDto){
    try{
        if(dto.deadline && new Date(dto.deadline).getTime() < Date.now()){
            throw new BadRequestException("Deadline must be in the future");
        }
        const responce = await this.jobRepository.create({ ...dto, authorId: userId, deadline: dto.deadline ? new Date(dto.deadline) : undefined });
        return await this.jobRepository.save(responce);
    }
    catch(error){
        throw error;
    }
}

async updateJob (id: string, userId: string, dto: UpdateJobDto){
    try{
        console.log("id",id);
        if(!id)
        {
            throw new NotFoundException("Job not found");
        }
        const job= await this.jobRepository.findOne(
            {
                where: {
                    id:id,
                },
            }        );
            if(!job){
                throw new NotFoundException("Job not found");
            }
            if(job.authorId !== userId){
                throw new ForbiddenException("You can only update your own job");
            }
            Object.assign(job,dto);
            if(dto.deadline) job.deadline = new Date(dto.deadline);
            
            const{id: uid, ...rest } =job  ;
            return await this.jobRepository.update({id:id}, rest);
    } catch (error){
        throw error;
    }
}

async deleteJob(id: string, userId: string){
    try{
        const job = await this.jobRepository.findOne({
            where: {
                id:id,
    },
        });
        if (!job) {
            throw new NotFoundException("Job not found");
        }
        if(job.authorId !== userId){
            throw new ForbiddenException("You can only delete your own job");
        }
        return await this.jobRepository.delete({ id:id });
    } catch (error) {
        throw error;
    }
}

async applyJob(id: string, userId: string, dto: ApplyJobDto){
    try{
        const job = await this.jobRepository.findOne({ where: { id: id } });
        if (!job) throw new NotFoundException("Job not found");
        if(job.authorId === userId) throw new ForbiddenException("You cannot apply to your own job");
        if(job.status !== JobStatus.OPEN) throw new BadRequestException("This job is not open");

        const existing = await this.appRepository.findOne({ where: { jobPostId: id, applicantId: userId } });
        if (existing) throw new ConflictException("You have already applied to this listing");

        const responce = this.appRepository.create({ ...dto, jobPostId: id, applicantId: userId });
        return await this.appRepository.save(responce);
    }
    catch(error){
        throw error;
    }
}

async getMyApplications(userId: string){
    try{
        const apps = await this.appRepository.find({ where: { applicantId: userId }, relations: ["jobPost"] });
        return apps;
    }
    catch(error){
        throw error;
    }
}

async getApplicationsForJob(id: string, userId: string){
    try{
        const job = await this.jobRepository.findOne({ where: { id: id } });
        if(!job) throw new NotFoundException("Job not found");
        if(job.authorId !== userId) throw new ForbiddenException("Not allowed");

        const apps = await this.appRepository.find({ where: { jobPostId: id }, relations: ["applicant"] });
        return apps;
    }
    catch(error){
        throw error;
    }
}

async updateApplicationStatus(id: string, appId: string, userId: string, dto: UpdateApplicationDto){
    try{
        const job = await this.jobRepository.findOne({ where: { id: id } });
        if(!job) throw new NotFoundException("Job not found");
        if(job.authorId !== userId) throw new ForbiddenException("Not allowed");

        const app = await this.appRepository.findOne({ where: { id: appId, jobPostId: id } });
        if(!app) throw new NotFoundException("Application not found");

        app.status = dto.status;
        if(dto.status === ApplicationStatus.ACCEPTED){
            job.status = JobStatus.CLOSED;
            await this.jobRepository.save(job);
        }
        return await this.appRepository.save(app);
    }
    catch(error){
        throw error;
    }
}

async withdrawApplication(id: string, userId: string){
    try{
        const app = await this.appRepository.findOne({ where: { id: id, applicantId: userId } });
        if(!app) throw new NotFoundException("Application not found");
        
        app.status = ApplicationStatus.WITHDRAWN;
        return await this.appRepository.save(app);
    }
    catch(error){
        throw error;
    }
}
}