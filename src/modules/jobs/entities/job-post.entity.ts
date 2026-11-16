import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
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

@Entity({name:"job_posts"})
export class JobPost {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "author_id", type: "uuid" })
    authorId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "author_id" })
    author!: User;

    @Column()
    title!: string;

    @Column()
    organization!: string;

    @Column({ type: "enum", enum: JobType })
    jobType!: JobType;

    @Column({ type: "text" })
    description!: string;

    @Column({ type: "varchar", length: 180, nullable: true })
    location?: string;

    @Column({ name: "application_url", type: "varchar", length: 500, nullable: true })
    applicationUrl?: string;

    @Column({ type: "timestamp", nullable: true })
    deadline?: Date;

    @Column({ type: "enum", enum: JobStatus, default: JobStatus.OPEN })
    status!: JobStatus;

    @OneToMany(() => JobApplication, (application) => application.jobPost)
    applications!: JobApplication[];

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}