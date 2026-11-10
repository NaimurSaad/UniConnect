import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedPost } from './entities/feed-post.entity';
import { PostMedia } from './entities/post-media.entity';
import { Comment } from './entities/comment.entity';
import { Reaction } from './entities/reaction.entity';
import { User } from '../users/entities/user.entity';
import { SocialFeedController } from './social-feed.controller';
import { SocialFeedService } from './social-feed.service';
import { IsContentOrMediaPresentConstraint } from './validators/is-content-or-media-present.validator';
import { IsPostAuthorGuard } from './guards/is-post-author.guard';

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
  providers: [
    SocialFeedService,
    IsContentOrMediaPresentConstraint,
    IsPostAuthorGuard,
  ],
  exports: [SocialFeedService, IsPostAuthorGuard],
})
export class SocialFeedModule {}
