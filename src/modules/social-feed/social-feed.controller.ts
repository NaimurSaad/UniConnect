import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Headers,
} from '@nestjs/common';
import { SocialFeedService } from './social-feed.service';
import {
  CreatePostDto,
  CreatePostMediaDto,
  UpdatePostDto,
  CreateCommentDto,
  SetReactionDto,
  FeedQueryDto,
} from './dto';

@Controller('feed')
export class SocialFeedController {
  constructor(private readonly socialFeedService: SocialFeedService) {}

  /**
   * Health Check: Verify module & entity status
   * GET /feed/health-check
   */
  @Get('health-check')
  getHealthCheck() {
    return this.socialFeedService.getHealthCheck();
  }

  /**
   * Validate Post Payload: Tests @IsContentOrMediaPresent custom validator
   * POST /feed/validate-post
   */
  @Post('validate-post')
  validatePost(@Body() dto: CreatePostDto) {
    return {
      valid: true,
      message: 'Post validation passed successfully!',
      data: dto,
    };
  }

  /**
   * Create Post: Business rule: content or media required
   * POST /feed/posts
   */
  @Post('posts')
  createPost(
    @Body() dto: CreatePostDto,
    @Headers('x-user-id') headerUserId?: string,
  ) {
    return this.socialFeedService.createPost(dto, headerUserId);
  }

  /**
   * Get Feed: Paginated community posts
   * GET /feed/posts?page=1&limit=10
   */
  @Get('posts')
  getFeedPosts(@Query() query: FeedQueryDto) {
    return this.socialFeedService.getFeedPosts(query);
  }

  /**
   * Get Single Post: Includes media, comments, and reactions
   * GET /feed/posts/:id
   */
  @Get('posts/:id')
  getPostById(@Param('id') id: string) {
    return this.socialFeedService.getPostById(id);
  }

  /**
   * Update Post: Edit content or visibility
   * PATCH /feed/posts/:id
   */
  @Patch('posts/:id')
  updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.socialFeedService.updatePost(id, dto);
  }

  /**
   * Soft Delete Post: Sets deleted_at timestamp
   * DELETE /feed/posts/:id
   */
  @Delete('posts/:id')
  deletePost(@Param('id') id: string) {
    return this.socialFeedService.deletePost(id);
  }

  /**
   * Add Comment to Post:
   * POST /feed/posts/:id/comments
   */
  @Post('posts/:id/comments')
  addComment(
    @Param('id') postId: string,
    @Body() dto: CreateCommentDto,
    @Headers('x-user-id') headerUserId?: string,
  ) {
    return this.socialFeedService.addComment(postId, dto, headerUserId);
  }

  /**
   * Get Comments for Post:
   * GET /feed/posts/:id/comments
   */
  @Get('posts/:id/comments')
  getComments(@Param('id') postId: string) {
    return this.socialFeedService.getComments(postId);
  }

  /**
   * Soft Delete Comment:
   * DELETE /feed/comments/:commentId
   */
  @Delete('comments/:commentId')
  deleteComment(@Param('commentId') commentId: string) {
    return this.socialFeedService.deleteComment(commentId);
  }

  /**
   * Set Reaction: Business rule: at most one reaction per user per post (upsert/toggle)
   * POST /feed/posts/:id/reactions
   */
  @Post('posts/:id/reactions')
  setReaction(
    @Param('id') postId: string,
    @Body() dto: SetReactionDto,
    @Headers('x-user-id') headerUserId?: string,
  ) {
    return this.socialFeedService.setReaction(postId, dto, headerUserId);
  }

  /**
   * Remove Reaction:
   * DELETE /feed/posts/:id/reactions
   */
  @Delete('posts/:id/reactions')
  removeReaction(
    @Param('id') postId: string,
    @Headers('x-user-id') headerUserId?: string,
  ) {
    return this.socialFeedService.removeReaction(postId, undefined, headerUserId);
  }

  /**
   * Add Media Attachment to an existing Post:
   * POST /feed/posts/:id/media
   */
  @Post('posts/:id/media')
  addMediaToPost(
    @Param('id') postId: string,
    @Body() dto: CreatePostMediaDto,
  ) {
    return this.socialFeedService.addMediaToPost(postId, dto);
  }

  /**
   * Get all Media Attachments for a Post:
   * GET /feed/posts/:id/media
   */
  @Get('posts/:id/media')
  getPostMedia(@Param('id') postId: string) {
    return this.socialFeedService.getPostMedia(postId);
  }

  /**
   * Delete a Media Attachment:
   * DELETE /feed/media/:mediaId
   */
  @Delete('media/:mediaId')
  deleteMedia(@Param('mediaId') mediaId: string) {
    return this.socialFeedService.deleteMedia(mediaId);
  }
}
