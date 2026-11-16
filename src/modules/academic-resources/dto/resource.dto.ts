import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";
import { NoteResourceStatus } from "../entities/note-resource.entity";

export class CreateResourceDto {
    @IsString()
    @IsNotEmpty({message:"Title can not be empty"})
    title!: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsString()
    @IsNotEmpty({message:"Course can not be empty"})
    course!: string;

    @IsOptional()
    @IsString()
    semester?: string;

    @IsUrl()
    @IsNotEmpty()
    fileUrl!: string;

    @IsString()
    @IsNotEmpty()
    mimeType!: string;

    @IsInt()
    @Min(1)
    @Max(10485760)
    @IsNotEmpty()
    fileSizeBytes!: number;

    @IsOptional()
    created_at?: Date = new Date();

    @IsOptional()
    updated_at?: Date = new Date();
}

export class UpdateResourceDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    course?: string;

    @IsOptional()
    @IsString()
    semester?: string;

    @IsOptional()
    @IsEnum(NoteResourceStatus)
    status?: NoteResourceStatus;

    @IsOptional()
    updated_at?: Date = new Date();
}