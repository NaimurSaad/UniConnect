import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { FeedPost } from "./feed-post.entity";
import { PostMediaType } from "../enums/social-feed.enums";

export { PostMediaType, PostMediaType as MediaType };

@Entity("post_media")
export class PostMedia {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  post_id!: string;

  @ManyToOne(() => FeedPost, (post) => post.media, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post!: FeedPost;

  @Column({
    type: "enum",
    enum: PostMediaType,
  })
  media_type!: PostMediaType;

  @Column({ type: "varchar", length: 500 })
  file_url!: string;

  @Column({ type: "varchar", length: 100 })
  mime_type!: string;

  @Column({ type: "bigint" })
  file_size_bytes!: string;

  @Column({ type: "int", default: 0 })
  sort_order!: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
