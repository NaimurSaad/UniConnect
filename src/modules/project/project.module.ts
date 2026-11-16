import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectComment } from './entities/project-comment.entity';
import { ProjectReaction } from './entities/project-reaction.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectComment, ProjectReaction])],
    controllers: [ProjectController],
    providers: [ProjectService],
    exports: [ProjectService],
})
export class ProjectModule { }