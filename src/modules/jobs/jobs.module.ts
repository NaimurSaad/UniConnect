import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JobPost } from "./entities/job-post.entity";
import { JobApplication } from "./entities/job-application.entity";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";

@Module({
  imports: [TypeOrmModule.forFeature([JobPost, JobApplication])],
  controllers: [JobsController],
  providers: [JobsService],
    exports: [JobsService],
})
export class JobsModule {}