import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { NotificationType } from '../enums/notification-type.enum';
import {
  PostCommentedEvent,
  PostReactedEvent,
  ConnectionRequestedEvent,
  ConnectionAcceptedEvent,
} from '../../../common/events/domain-events';

@Injectable()
export class NotificationsListener {
  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * 1. Handle 'post.commented' event.
   * Notifies the post author when someone comments on their post.
   * Skips if author commented on their own post.
   */
  @OnEvent('post.commented')
  async handlePostCommented(event: PostCommentedEvent) {
    try {
      if (event.postAuthorId === event.commenterId) {
        return;
      }

      await this.notificationsService.createNotification({
        user_id: event.postAuthorId,
        notification_type: NotificationType.POST_COMMENTED,
        message: 'Someone commented on your post.',
        related_entity_type: 'post',
        related_entity_id: event.postId,
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  /**
   * 2. Handle 'post.reacted' event.
   * Notifies the post author when someone reacts to their post.
   * Skips if author reacted to their own post.
   */
  @OnEvent('post.reacted')
  async handlePostReacted(event: PostReactedEvent) {
    try {
      if (event.postAuthorId === event.reactorId) {
        return;
      }

      await this.notificationsService.createNotification({
        user_id: event.postAuthorId,
        notification_type: NotificationType.POST_REACTED,
        message: `Someone reacted (${event.reactionType}) to your post.`,
        related_entity_type: 'post',
        related_entity_id: event.postId,
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  /**
   * 3. Handle 'connection.requested' event.
   * Notifies the receiver that they received a new connection request.
   */
  @OnEvent('connection.requested')
  async handleConnectionRequested(event: ConnectionRequestedEvent) {
    try {
      await this.notificationsService.createNotification({
        user_id: event.receiverId,
        notification_type: NotificationType.CONNECTION_REQUESTED,
        message: 'You received a new connection request.',
        related_entity_type: 'connection',
        related_entity_id: event.connectionId,
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  /**
   * 4. Handle 'connection.accepted' event.
   * Notifies the requester that their connection request was accepted.
   */
  @OnEvent('connection.accepted')
  async handleConnectionAccepted(event: ConnectionAcceptedEvent) {
    try {
      await this.notificationsService.createNotification({
        user_id: event.requesterId,
        notification_type: NotificationType.CONNECTION_ACCEPTED,
        message: 'Your connection request was accepted.',
        related_entity_type: 'connection',
        related_entity_id: event.connectionId,
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }
}

