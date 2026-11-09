import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPost } from './entities/feed-post.entity';
import { PostMedia } from './entities/post-media.entity';
import { Comment } from './entities/comment.entity';
import { Reaction } from './entities/reaction.entity';
import { User } from '../users/entities/user.entity';
import { SocialFeedController } from './social-feed.controller';
import { SocialFeedService } from './social-feed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FeedPost,
      PostMedia,
      Comment,
      Reaction,
      User,
    ]),
  ],
  controllers: [SocialFeedController],
  providers: [SocialFeedService],
  exports: [SocialFeedService],
})
export class SocialFeedModule {}
