import {
  Entity, PrimaryGeneratedColumn,Column,ManyToOne,OneToMany, CreateDateColumn,UpdateDateColumn,JoinColumn,Index,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { JobApplication } from "./job-application.entity";

export enum JobType {
  JOB = "job",
  INTERNSHIP = "internship",
}

export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
  DRAFT = "draft",
}

@Entity({ name: "job_posts" })
@Index(["status", "jobType", "deadline"])
export class JobPost {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "author_id", type: "uuid" })
  authorId!: string;

  @ManyToOne(() => User, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "author_id" })
  author!: User;

  @Column({ type: "varchar", length: 180 })
  title!: string;

  @Column({ type: "varchar", length: 180 })
  organization!: string;

  @Column({ name: "job_type", type: "enum", enum: JobType })
  jobType!: JobType;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 180, nullable: true })
  location!: string | null;

  @Column({
    name: "application_url",
    type: "varchar",
    length: 500,
    nullable: true,
  })
  applicationUrl!: string | null;

  @Column({ type: "timestamp", nullable: true })
  deadline!: Date | null;

  @Column({
    type: "enum",
    enum: JobStatus,
    default: JobStatus.OPEN,
  })
  status!: JobStatus;

  @OneToMany(() => JobApplication, (application) => application.jobPost)
  applications!: JobApplication[];

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}