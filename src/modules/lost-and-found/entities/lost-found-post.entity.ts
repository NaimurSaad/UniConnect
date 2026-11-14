import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum LostFoundType {
  LOST = 'lost',
  FOUND = 'found',
}

export enum LostFoundStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

@Entity({ name: 'lost_found_posts' })
export class LostFoundPost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author!: User;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @Column({ name: 'post_type', type: 'varchar', length: 10 })
  postType!: LostFoundType;

  @Column({ name: 'item_category', type: 'varchar', length: 100 })
  itemCategory!: string;

  @Column({ type: 'varchar', length: 180 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', length: 180, nullable: true })
  location!: string | null;

  @Column({ name: 'event_date', type: 'date', nullable: true })
  eventDate!: Date | null;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl!: string | null;

  @Column({ type: 'varchar', length: 20, default: LostFoundStatus.ACTIVE })
  status!: LostFoundStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}