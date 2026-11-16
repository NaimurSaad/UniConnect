import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPaginationDto } from './dto/notification-pagination.dto';
import { RequireUserGuard } from '../../common/guards/require-user.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Health Check: Module verification endpoint
   * GET /notifications/health-check
   */
  @Get('health-check')
  getHealthCheck() {
    return this.notificationsService.getHealthCheck();
  }

  /**
   * Test endpoint to create a polymorphic notification:
   * POST /notifications/test
   */
  @Post('test')
  createTestNotification(@Body() createDto: CreateNotificationDto) {
    return this.notificationsService.createNotification(createDto);
  }

  /**
   * 1. Get Unread Notifications Count:
   * GET /notifications/unread-count
   */
  @Get('unread-count')
  @UseGuards(RequireUserGuard)
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  /**
   * 2. Get Paginated Notifications for Authenticated User:
   * GET /notifications?page=1&limit=10
   */
  @Get()
  @UseGuards(RequireUserGuard)
  getUserNotifications(
    @CurrentUser('id') userId: string,
    @Query() paginationDto: NotificationPaginationDto,
  ) {
    return this.notificationsService.getUserNotifications(userId, paginationDto);
  }

  /**
   * 3. Batch Update: Mark All Unread Notifications as Read:
   * PATCH /notifications/read-all
   * Note: Defined BEFORE ':id/read' to prevent route collision with UUID param.
   */
  @Patch('read-all')
  @UseGuards(RequireUserGuard)
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }

  /**
   * 4. Mark Single Notification as Read:
   * PATCH /notifications/:id/read
   */
  @Patch(':id/read')
  @UseGuards(RequireUserGuard)
  markAsRead(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAsRead(id, userId);
  }
}

