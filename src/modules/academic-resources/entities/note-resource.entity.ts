import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../user/entities/user.entity"; 

export enum NoteResourceStatus {
  AVAILABLE = "available",
  HIDDEN = "hidden",
}

@Entity({ name: "note_resources" })
export class NoteResource {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "uploader_id", type: "uuid" })
    uploaderId!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    @JoinColumn({ name: "uploader_id" })
    uploader!: User;

    @Column({ type: "varchar", length: 180 })
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string | null;

    @Column({ type: "varchar", length: 100 })
    course!: string;

    @Column({ type: "varchar", length: 40, nullable: true })
    semester?: string | null;

    @Column({ name: "file_url", type: "varchar", length: 500 })
    fileUrl!: string;

    @Column({ name: "mime_type", type: "varchar", length: 100 })
    mimeType!: string;

    @Column({ name: "file_size_bytes", type: "bigint" })
    fileSizeBytes!: string; 

    @Column({ type: "enum", enum: NoteResourceStatus, default: NoteResourceStatus.AVAILABLE })
    status!: NoteResourceStatus;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}