import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FeedPost } from '../../social-feed/entities/feed-post.entity';
import { Comment } from '../../social-feed/entities/comment.entity';
import { Reaction } from '../../social-feed/entities/reaction.entity';

/**
 * Minimal User stub entity representing Student 1's authentication domain.
 * Allows Student 2's Social Feed relations to compile and link cleanly.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 120 })
  full_name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'active', 'suspended', 'disabled'],
    default: 'active',
  })
  account_status!: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @OneToMany(() => FeedPost, (post) => post.author)
  feed_posts!: FeedPost[];

  @OneToMany(() => Comment, (comment) => comment.author)
  comments!: Comment[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions!: Reaction[];
}

