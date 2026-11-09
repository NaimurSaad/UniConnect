import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { FeedPost } from "./feed-post.entity";
import { User } from "../../users/entities/user.entity";
@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  post_id!: string;

  @ManyToOne(() => FeedPost, (post) => post.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post!: FeedPost;

  @Column({ type: "uuid" })
  author_id!: string;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author!: User;

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at!: Date | null;
}
