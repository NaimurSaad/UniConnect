import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  /**
   * Health Check: Module verification endpoint
   * GET /connections/health-check
   */
  @Get('health-check')
  getHealthCheck() {
    return this.connectionsService.getHealthCheck();
  }

  /**
   * Send Connection Request with Bidirectional Conflict Resolution:
   * POST /connections/request/:targetUserId
   * Injects requesterId via @CurrentUser('id') (supports JWT, 'user-id' header)
   */
  @Post('request/:targetUserId')
  sendRequest(
    @CurrentUser('id') requesterId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    if (!requesterId) {
      throw new BadRequestException('User ID header (user-id) is required.');
    }
    return this.connectionsService.sendRequest(requesterId, targetUserId);
  }

  /**
   * Accept Connection Request:
   * PATCH /connections/:id/accept
   * Only the receiver can accept.
   */
  @Patch(':id/accept')
  acceptRequest(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID header (user-id) is required.');
    }
    return this.connectionsService.acceptRequest(id, userId);
  }

  /**
   * Reject Connection Request:
   * PATCH /connections/:id/reject
   * Only the receiver can reject.
   */
  @Patch(':id/reject')
  rejectRequest(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID header (user-id) is required.');
    }
    return this.connectionsService.rejectRequest(id, userId);
  }

  /**
   * Cancel Connection Request:
   * DELETE /connections/:id/cancel
   * Only the requester can cancel.
   */
  @Delete(':id/cancel')
  cancelRequest(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    if (!userId) {
      throw new BadRequestException('User ID header (user-id) is required.');
    }
    return this.connectionsService.cancelRequest(id, userId);
  }

  /**
   * Block User:
   * POST /connections/block/:targetUserId
   * Injects actorId via @CurrentUser('id')
   */
  @Post('block/:targetUserId')
  blockUser(
    @CurrentUser('id') actorId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    if (!actorId) {
      throw new BadRequestException('User ID header (user-id) is required.');
    }
    return this.connectionsService.blockUser(actorId, targetUserId);
  }

  /**
   * Unblock User:
   * DELETE /connections/unblock/:targetUserId
   * Injects actorId via @CurrentUser('id')
   */
  @Delete('unblock/:targetUserId')
  unblockUser(
    @CurrentUser('id') actorId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    if (!actorId) {
      throw new BadRequestException('User ID header (user-id) is required.');
    }
    return this.connectionsService.unblockUser(actorId, targetUserId);
  }
}
