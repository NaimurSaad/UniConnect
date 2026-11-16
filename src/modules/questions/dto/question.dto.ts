import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty({message:"Title can not be empty"})
    @Length(5, 180)
    title!: string;

    @IsString()
    @IsNotEmpty({message:"Content can not be empty"})
    content!: string;

    @IsOptional()
    created_at?: Date = new Date();

    @IsOptional()
    updated_at?: Date = new Date();
}

export class UpdateQuestionDto {
    @IsOptional()
    @IsString()
    @Length(5, 180)
    title?: string;

    @IsOptional()
    @IsString()
    content?: string;

    @IsOptional()
    updated_at?: Date = new Date();
}

export class CreateAnswerDto {
    @IsString()
    @IsNotEmpty({message:"Content can not be empty"})
    content!: string;

    @IsOptional()
    created_at?: Date = new Date();
}

export class UpdateAnswerDto {
    @IsString()
    @IsNotEmpty()
    content!: string;

    @IsOptional()
    updated_at?: Date = new Date();
}