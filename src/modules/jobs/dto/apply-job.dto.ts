import {
  IsOptional,
  IsString,
  MaxLength,
  IsUrl,
} from "class-validator";

export class ApplyJobDto {
  @IsOptional()
  @IsString()
  coverLetter: string = "";

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  resumeUrl: string = "";
}