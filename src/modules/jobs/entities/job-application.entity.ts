import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { JobPost } from "./job-post.entity";

export enum ApplicationStatus {
  SUBMITTED = "submitted",
  REVIEWING = "reviewing",
  SHORTLISTED = "shortlisted",
  REJECTED = "rejected",
  ACCEPTED = "accepted",
  WITHDRAWN = "withdrawn",
}

@Entity({name:"job_applications"})
@Index(["jobPostId", "applicantId"], { unique: true })
export class JobApplication {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "job_post_id", type: "uuid" })
    jobPostId!: string;

    @ManyToOne(() => JobPost, (job) => job.applications, { onDelete: "CASCADE" })
    @JoinColumn({ name: "job_post_id" })
    jobPost!: JobPost;

    @Column({ name: "applicant_id", type: "uuid" })
    applicantId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "applicant_id" })
    applicant!: User;

    @Column({ name: "cover_letter", type: "text", nullable: true })
    coverLetter?: string | null;

    @Column({ name: "resume_url", type: "varchar", length: 500, nullable: true  })
    resumeUrl?: string | null;

    @Column({ type: "enum", enum: ApplicationStatus, default: ApplicationStatus.SUBMITTED })
    status!: ApplicationStatus;

    @CreateDateColumn({ name: "applied_at" })
    appliedAt?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}