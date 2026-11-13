import {
  Controller,
  Get,
  Post,
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
}
