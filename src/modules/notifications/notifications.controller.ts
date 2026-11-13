import { Controller, Get, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

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
}

