import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateProjectDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    title!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    courseName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    semester?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    techStack?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    githubUrl?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    liveUrl?: string;
}

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    @MaxLength(150)
    courseName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    semester?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    techStack?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    githubUrl?: string;

    @IsOptional()
    @IsUrl()
    @MaxLength(255)
    liveUrl?: string;
}

export class CreateProjectCommentDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(2000)
    content!: string;
}

export class ProjectQueryDto {
    @IsOptional()
    @IsString()
    course?: string;

    @IsOptional()
    @IsString()
    semester?: string;

    @IsOptional()
    @IsString()
    search?: string;
}