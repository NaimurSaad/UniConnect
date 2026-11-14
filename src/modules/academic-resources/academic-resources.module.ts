import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NoteResource } from "./entities/note-resource.entity";
import { AcademicResourcesController } from "./academic-resources.controller";
import { AcademicResourcesService } from "./academic-resources.service";

@Module({
  imports: [TypeOrmModule.forFeature([NoteResource])],
  controllers: [AcademicResourcesController],
  providers: [AcademicResourcesService],
    exports: [AcademicResourcesService],
})
export class AcademicResourcesModule {}