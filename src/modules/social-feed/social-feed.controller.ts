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
  UseInterceptors,
  UseGuards,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, MAX_IMAGE_SIZE_BYTES } from '../../common/utils/multer-options.util';
import { PostMediaType } from './enums/social-feed.enums';
import { SocialFeedService } from './social-feed.service';
import { IsPostAuthorGuard } from './guards/is-post-author.guard';
import {
  CreatePostDto,
  CreatePostMediaDto,
  UpdatePostDto,
  CreateCommentDto,
  SetReactionDto,
  FeedQueryDto,
  FeedPaginationDto,
  MediaUploadResponseDto,
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
   * Upload Media File:
   * POST /feed/upload-media
   * Multipart/form-data with field 'file'
   */
  @Post('upload-media')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  uploadMedia(
    @UploadedFile() file: Express.Multer.File,
  ): MediaUploadResponseDto {
    if (!file) {
      throw new BadRequestException('A file is required for upload (field name: "file").');
    }

    // Enforce 5MB limit for images
    if (file.mimetype.startsWith('image/') && file.size > MAX_IMAGE_SIZE_BYTES) {
      throw new BadRequestException('Image file size cannot exceed 5MB.');
    }

    const media_type = file.mimetype.startsWith('video/')
      ? PostMediaType.VIDEO
      : PostMediaType.IMAGE;

    return {
      media_type,
      file_url: `/uploads/posts/${file.filename}`,
      mime_type: file.mimetype,
      file_size_bytes: file.size,
    };
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
   * Create Post with Transactional Persistence:
   * POST /feed/posts
   */
  @Post('posts')
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Headers('x-user-id') headerUserId?: string,
  ) {
    return this.socialFeedService.createPost(createPostDto, headerUserId);
  }

  /**
   * Get Feed: Cursor-based paginated community posts
   * GET /feed/posts?limit=10&cursor=...
   */
  @Get('posts')
  getFeed(@Query() paginationDto: FeedPaginationDto) {
    return this.socialFeedService.getFeed(paginationDto);
  }

  /**
   * Validate Post Creation DTO Pipeline:
   * POST /feed/posts/validate-create
   */
  @Post('posts/validate-create')
  validateCreatePost(@Body() dto: CreatePostDto) {
    return {
      valid: true,
      type: 'create',
      data: dto,
    };
  }

  /**
   * Validate Post Update DTO Pipeline:
   * PATCH /feed/posts/validate-update
   */
  @Patch('posts/validate-update')
  validateUpdatePost(@Body() dto: UpdatePostDto) {
    return {
      valid: true,
      type: 'update',
      data: dto,
    };
  }

  /**
   * Verify Post Ownership (Guard Protected):
   * GET /feed/posts/:id/verify-owner
   * Protected by IsPostAuthorGuard: requires matching 'user-id' (or 'x-user-id') header
   */
  @Get('posts/:id/verify-owner')
  @UseGuards(IsPostAuthorGuard)
  verifyPostOwner(@Param('id') id: string) {
    return {
      authorized: true,
      message: 'Post ownership verified successfully',
      post_id: id,
    };
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
