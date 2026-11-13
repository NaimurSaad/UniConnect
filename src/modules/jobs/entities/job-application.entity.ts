import {Column,Entity,PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn} from "typeorm";

export enum ApplicationStatus {
  SUBMITTED = "submitted",
  REVIEWING = "reviewing",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  WITHDRAWN = "withdrawn",
}


@Entity({name:"job_application"}) 

export class JobApplication {

  @PrimaryGeneratedColumn ("uuid")
  id! : string;

  @Column ({name : "job_post_id" , type: "uuid"})
  jobPostId! : string;

  @Column ({name : "applicant_id" , type: "uuid"})
  applicantId ! : string ;

  @Column({ name: "cover_letter", type: "text", nullable: true })
  coverLetter!: string | null;

  @Column({ name: "resume_url", type: "varchar", length: 500, nullable: true })
  resumeUrl!: string | null;

  @Column({ 
    type: "enum", 
    enum: ApplicationStatus, 
    default: ApplicationStatus.SUBMITTED 
  })

  @CreateDateColumn({ name: "applied_at", type: "timestamp" })
  appliedAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;




}

