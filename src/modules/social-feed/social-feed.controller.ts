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
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions, MAX_IMAGE_SIZE_BYTES } from '../../common/utils/multer-options.util';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { PostMediaType } from './enums/social-feed.enums';
import { SocialFeedService } from './social-feed.service';
import { IsPostAuthorGuard } from './guards/is-post-author.guard';
import { IsCommentAuthorGuard } from './guards/is-comment-author.guard';
import {
  CreatePostDto,
  CreatePostMediaDto,
  UpdatePostDto,
  CreateCommentDto,
  UpdateCommentDto,
  SetReactionDto,
  ReactPostDto,
  QueryReactionDto,
  FeedQueryDto,
  FeedPaginationDto,
  CommentPaginationDto,
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
    @CurrentUser('id') currentUserId?: string,
  ) {
    return this.socialFeedService.createPost(createPostDto, currentUserId);
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
   * Protected by IsPostAuthorGuard: requires matching 'user-id' (or 'x-user-id') header
   */
  @Patch('posts/:id')
  @UseGuards(IsPostAuthorGuard)
  updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.socialFeedService.updatePost(id, updatePostDto);
  }

  /**
   * Soft Delete Post: Sets deleted_at timestamp
   * DELETE /feed/posts/:id
   * Protected by IsPostAuthorGuard: requires matching 'user-id' (or 'x-user-id') header
   */
  @Delete('posts/:id')
  @UseGuards(IsPostAuthorGuard)
  deletePost(@Param('id') id: string) {
    return this.socialFeedService.deletePost(id);
  }

  /**
   * Add Comment to Post:
   * POST /feed/posts/:postId/comments
   */
  @Post('posts/:postId/comments')
  addComment(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') currentUserId?: string,
  ) {
    return this.socialFeedService.addComment(postId, createCommentDto, currentUserId);
  }

  /**
   * Get Comments for Post with Offset Pagination:
   * GET /feed/posts/:postId/comments?page=1&limit=10
   */
  @Get('posts/:postId/comments')
  getComments(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() paginationDto: CommentPaginationDto,
  ) {
    return this.socialFeedService.getCommentsByPost(postId, paginationDto);
  }

  /**
   * Update Comment Content:
   * PATCH /feed/comments/:id
   * Protected by IsCommentAuthorGuard: requires matching 'user-id' (or 'x-user-id') header
   */
  @Patch('comments/:id')
  @UseGuards(IsCommentAuthorGuard)
  updateComment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.socialFeedService.updateComment(id, updateCommentDto);
  }

  /**
   * Soft Delete Comment:
   * DELETE /feed/comments/:id
   * Protected by IsCommentAuthorGuard: requires matching 'user-id' (or 'x-user-id') header
   */
  @Delete('comments/:id')
  @UseGuards(IsCommentAuthorGuard)
  deleteComment(@Param('id', ParseUUIDPipe) id: string) {
    return this.socialFeedService.deleteComment(id);
  }

  /**
   * React to Post (Toggle & Upsert):
   * POST /feed/posts/:postId/reactions
   */
  @Post('posts/:postId/reactions')
  reactToPost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() reactDto: ReactPostDto,
    @CurrentUser('id') currentUserId?: string,
  ) {
    return this.socialFeedService.reactToPost(postId, reactDto, currentUserId);
  }

  /**
   * Get Reactions Summary & User List (with optional type filter):
   * GET /feed/posts/:postId/reactions
   */
  @Get('posts/:postId/reactions')
  getPostReactionsSummary(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() queryDto: QueryReactionDto,
  ) {
    return this.socialFeedService.getPostReactionsSummary(postId, queryDto.type);
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
