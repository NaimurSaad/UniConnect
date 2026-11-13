import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ConnectionsService } from './connections.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RequireUserGuard } from '../../common/guards/require-user.guard';

@Controller('connections')
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  /**
   * Health Check: Module verification endpoint (Public)
   * GET /connections/health-check
   */
  @Get('health-check')
  getHealthCheck() {
    return this.connectionsService.getHealthCheck();
  }

  /**
   * Get Received Pending Connection Requests:
   * GET /connections/pending
   */
  @Get('pending')
  @UseGuards(RequireUserGuard)
  getPendingRequests(@CurrentUser('id') userId: string) {
    return this.connectionsService.getPendingRequests(userId);
  }

  /**
   * Get Sent Pending Connection Requests:
   * GET /connections/sent
   */
  @Get('sent')
  @UseGuards(RequireUserGuard)
  getSentRequests(@CurrentUser('id') userId: string) {
    return this.connectionsService.getSentRequests(userId);
  }

  /**
   * Get Connection Status with Target User:
   * GET /connections/status/:targetUserId
   */
  @Get('status/:targetUserId')
  @UseGuards(RequireUserGuard)
  getConnectionStatus(
    @CurrentUser('id') userId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    return this.connectionsService.getConnectionStatus(userId, targetUserId);
  }

  /**
   * Get Accepted Connections (Friends List):
   * GET /connections
   */
  @Get()
  @UseGuards(RequireUserGuard)
  getAcceptedConnections(@CurrentUser('id') userId: string) {
    return this.connectionsService.getAcceptedConnections(userId);
  }

  /**
   * Send Connection Request with Bidirectional Conflict Resolution:
   * POST /connections/request/:targetUserId
   */
  @Post('request/:targetUserId')
  @UseGuards(RequireUserGuard)
  sendRequest(
    @CurrentUser('id') requesterId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    return this.connectionsService.sendRequest(requesterId, targetUserId);
  }

  /**
   * Accept Connection Request:
   * PATCH /connections/:id/accept
   */
  @Patch(':id/accept')
  @UseGuards(RequireUserGuard)
  acceptRequest(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.connectionsService.acceptRequest(id, userId);
  }

  /**
   * Reject Connection Request:
   * PATCH /connections/:id/reject
   */
  @Patch(':id/reject')
  @UseGuards(RequireUserGuard)
  rejectRequest(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.connectionsService.rejectRequest(id, userId);
  }

  /**
   * Cancel Connection Request:
   * DELETE /connections/:id/cancel
   * (Placed before generic DELETE :id to prevent route shadowing)
   */
  @Delete(':id/cancel')
  @UseGuards(RequireUserGuard)
  cancelRequest(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.connectionsService.cancelRequest(id, userId);
  }

  /**
   * Unblock User:
   * DELETE /connections/unblock/:targetUserId
   * (Placed before generic DELETE :id to prevent route shadowing)
   */
  @Delete('unblock/:targetUserId')
  @UseGuards(RequireUserGuard)
  unblockUser(
    @CurrentUser('id') actorId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    return this.connectionsService.unblockUser(actorId, targetUserId);
  }

  /**
   * Remove Connection (Unfriend):
   * DELETE /connections/:id
   */
  @Delete(':id')
  @UseGuards(RequireUserGuard)
  removeConnection(
    @CurrentUser('id') userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.connectionsService.removeConnection(id, userId);
  }

  /**
   * Block User:
   * POST /connections/block/:targetUserId
   */
  @Post('block/:targetUserId')
  @UseGuards(RequireUserGuard)
  blockUser(
    @CurrentUser('id') actorId: string,
    @Param('targetUserId', ParseUUIDPipe) targetUserId: string,
  ) {
    return this.connectionsService.blockUser(actorId, targetUserId);
  }
}
