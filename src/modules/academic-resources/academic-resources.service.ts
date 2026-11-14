import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CreateResourceDto} from "./dto/resource.dto";
import {NoteResource, NoteResourceStatus} from "./entities/note-resource.entity";

@Injectable()
export class AcademicResourcesService {
    constructor(
        @InjectRepository(NoteResource)
        private readonly noteResourceRepository: Repository<NoteResource>
    ) {}

    async getResources(search?: string , course?: string){
        try{
            const qb = this.noteResourceRepository.createQueryBuilder("note_resource").leftJoinAndSelect("note_resource.uploader", "uploader") ;
            
            qb.where("note_resource.status = :status", { status: NoteResourceStatus.AVAILABLE });

            if(search) qb.andWhere("note_resource.title ILIKE :search OR note_resource.description ILIKE :search", { search: `%${search}%` });
            if(course) qb.andWhere("note_resource.course = :course", { course });

            qb.orderBy("note_resource.created_at", "DESC");

            const resources = await qb.getMany();
            const notes = await qb .getMany();
            return resources;
            



        } catch (error) {
            throw error;
        }
    }

}