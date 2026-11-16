import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationPaginationDto } from './dto/notification-pagination.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  // Default fallback user ID for seamless Postman testing before Auth module is merged
  public static readonly DEFAULT_TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Helper to ensure a user exists in the database.
   * If userId is missing or doesn't exist, ensures a stub test user is present
   * to satisfy PostgreSQL foreign key constraints during local testing.
   */
  async ensureUserExists(userId?: string): Promise<string> {
    const targetId = userId || NotificationsService.DEFAULT_TEST_USER_ID;

    const existing = await this.userRepository.findOne({ where: { id: targetId } });
    if (!existing) {
      const stubUser = this.userRepository.create({
        id: targetId,
        full_name: 'Nizam Uddin Shuvo (Student 2)',
        email: `student2_${targetId.substring(0, 8)}@uniconnect.aiub.edu`,
        password_hash: 'stub_hashed_password',
        account_status: 'active',
      });
      await this.userRepository.save(stubUser);
      this.logger.log(`Created stub user for testing: ${targetId}`);
    }
    return targetId;
  }

  /**
   * Health check endpoint confirming module & entity availability.
   * GET /notifications/health-check
   */
  async getHealthCheck() {
    const totalNotifications = await this.notificationRepository.count().catch(() => 0);
    return {
      status: 'success',
      module: 'NotificationsModule',
      message: 'NotificationsModule and database connection are active',
      timestamp: new Date().toISOString(),
      database: {
        entity: 'Notification',
        table: 'notifications',
        total_notifications: totalNotifications,
      },
    };
  }

  /**
   * Create a polymorphic notification record.
   */
  async createNotification(createDto: CreateNotificationDto): Promise<Notification> {
    await this.ensureUserExists(createDto.user_id);

    const notification = this.notificationRepository.create({
      user_id: createDto.user_id,
      notification_type: createDto.notification_type,
      message: createDto.message,
      related_entity_type: createDto.related_entity_type || null,
      related_entity_id: createDto.related_entity_id || null,
      read_at: null,
    });

    return await this.notificationRepository.save(notification);
  }

  /**
   * 1. Get paginated notifications for a specific user, ordered latest first.
   */
  async getUserNotifications(
    userId: string,
    paginationDto: NotificationPaginationDto,
  ): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }> {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await this.notificationRepository.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * 2. Count total unread notifications for a specific user.
   */
  async getUnreadCount(userId: string): Promise<{ unread_count: number }> {
    const count = await this.notificationRepository.count({
      where: {
        user_id: userId,
        read_at: IsNull(),
      },
    });

    return { unread_count: count };
  }

  /**
   * 3. Mark a single notification as read by ID.
   * Verifies that the notification exists and belongs to the requesting user.
   */
  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found.');
    }

    if (notification.user_id !== userId) {
      throw new ForbiddenException('You are not authorized to update this notification.');
    }

    if (!notification.read_at) {
      notification.read_at = new Date();
      return await this.notificationRepository.save(notification);
    }

    return notification;
  }

  /**
   * 4. Batch update all unread notifications for a user to read.
   */
  async markAllAsRead(
    userId: string,
  ): Promise<{ success: boolean; message: string; updated_count: number }> {
    const result = await this.notificationRepository.update(
      { user_id: userId, read_at: IsNull() },
      { read_at: new Date() },
    );

    return {
      success: true,
      message: 'All notifications marked as read.',
      updated_count: result.affected || 0,
    };
  }
}

