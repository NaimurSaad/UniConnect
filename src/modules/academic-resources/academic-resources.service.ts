import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { NoteResource, NoteResourceStatus } from "./entities/note-resource.entity";
import { CreateResourceDto, UpdateResourceDto } from "./dto/resource.dto";

@Injectable()
export class AcademicResourcesService {
constructor
(@InjectRepository(NoteResource)
private readonly noteRepository: Repository<NoteResource>,
){}

async getResources(search?: string, course?: string){
    try{
        const qb = this.noteRepository.createQueryBuilder("note").leftJoinAndSelect("note.uploader", "uploader");
        qb.andWhere("note.status = :status", { status: NoteResourceStatus.AVAILABLE });
        if(search) qb.andWhere("(note.title ILIKE :s OR note.description ILIKE :s)", { s: `%${search}%` });
        if(course) qb.andWhere("note.course ILIKE :c", { c: `%${course}%` });
        
        
        qb.orderBy("note.created_at", "DESC");
        const notes = await qb.getMany();
        return notes;
    }
    catch (error){
        throw error;
    }
}

async createResource(userId: string, dto: CreateResourceDto){
    try{
        const allowedMime = ["application/pdf", "application/msword", "text/plain", "image/png", "image/jpeg"];
        if(!allowedMime.includes(dto.mimeType)){
            throw new BadRequestException("Unsupported file type");
        }
        const responce = await this.noteRepository.create({ ...dto, uploaderId: userId, fileSizeBytes: String(dto.fileSizeBytes) });
        return await this.noteRepository.save(responce);
    }
    catch(error){
        throw error;
    }
}

async updateResource (id: string, userId: string, dto: UpdateResourceDto){
    try{
        console.log("id",id);
        if(!id)
        {
            throw new NotFoundException("Resource not found");
        }
        const note= await this.noteRepository.findOne(
            {
                where: {
                    id:id,
                },
            }        );
            if(!note){
                throw new NotFoundException("Resource not found");
            }
            if(note.uploaderId !== userId){
                throw new ForbiddenException("You can only update your own resources");
            }
            Object.assign(note,dto);
            const{id: uid, ...rest } =note  ;
            return await this.noteRepository.update({id:id}, rest);
    } catch (error){
        throw error;
    }
}

async deleteResource(id: string, userId: string){
    try{
        const note = await this.noteRepository.findOne({
            where: {
                id:id,
    },
        });
        if (!note) {
            throw new NotFoundException("Resource not found");
        }
        if(note.uploaderId !== userId){
            throw new ForbiddenException("You can only delete your own resources");
        }
        return await this.noteRepository.delete({ id:id });
    } catch (error) {
        throw error;
    }
}
}