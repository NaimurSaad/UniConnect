import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from "typeorm";
import { FeedPost } from "./feed-post.entity";
import { User } from "../../users/entities/user.entity";
import { ReactionType } from "../enums/social-feed.enums";

export { ReactionType };

@Entity("reactions")
@Unique(["post_id", "user_id"])
export class Reaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  post_id!: string;

  @ManyToOne(() => FeedPost, (post) => post.reactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "post_id" })
  post!: FeedPost;

  @Column({ type: "uuid" })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.reactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user!: User;

  @Column({
    type: "enum",
    enum: ReactionType,
  })
  reaction_type!: ReactionType;

  @CreateDateColumn({ type: "timestamp" })
  created_at!: Date;
}
