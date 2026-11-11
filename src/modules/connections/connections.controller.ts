import { Controller, Get } from '@nestjs/common';
import { ConnectionsService } from './connections.service';

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
}

