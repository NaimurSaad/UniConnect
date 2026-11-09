import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { PostMedia } from "./post-media.entity";
import { Comment } from "./comment.entity";
import { Reaction } from "./reaction.entity";

export enum PostVisibility {
  COMMUNITY = "community",
}

@Entity("feed_posts")
export class FeedPost {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  author_id!: string;

  @ManyToOne(() => User, (user) => user.feed_posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "author_id" })
  author!: User;

  @Column({ type: "text", nullable: true })
  content!: string | null;

  @Column({
    type: "enum",
    enum: PostVisibility,
    default: PostVisibility.COMMUNITY,
  })
  visibility!: PostVisibility;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at!: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at!: Date | null;

  @OneToMany(() => PostMedia, (media) => media.post, { cascade: true })
  media!: PostMedia[];

  @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
  comments!: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.post, { cascade: true })
  reactions!: Reaction[];
}
