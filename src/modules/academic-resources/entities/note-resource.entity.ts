import {Column, Entity, PrimaryGeneratedColumn , CreateDateColumn, UpdateDateColumn,ManyToMany ,JoinColumn} from "typeorm";
import {User} from "../../user/entities/user.entity";

export enum NoteResourceType {
    AVAILABLE = "available",
    HIDDEN = "hidden",
}

@Entity({ name: "note_resources" })
export class NoteResource {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "uploader_id", type: "uuid" })
    uploaderId!: string;

    @ManyToMany(() => User)
    @JoinColumn({ name: "uploader_id" })
    uploader!: User;

    @Column()
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column()
    course!: string;

    @Column({ nullable: true })
    semester?: string;

    @Column({ name: "file_url" })
    fileUrl!: string;

    @Column({ name: "mime_type" })
    mimeType!: string;

    @Column({ name: "file_size_bytes", type: "bigint" })
    fileSizeBytes!: string;

    @Column({ type: "enum", enum: NoteResourceType, default: NoteResourceType.AVAILABLE })
    type!: NoteResourceType;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}
