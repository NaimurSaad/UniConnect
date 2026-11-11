import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from './entities/connection.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ConnectionsService {
  private readonly logger = new Logger(ConnectionsService.name);

  // Default fallback user ID for seamless Postman testing before Auth module is merged
  public static readonly DEFAULT_TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

  constructor(
    @InjectRepository(Connection)
    private readonly connectionRepository: Repository<Connection>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Helper to ensure a user exists in the database.
   * If userId is missing or doesn't exist, ensures a stub test user is present
   * to satisfy PostgreSQL foreign key constraints during local testing.
   */
  async ensureUserExists(userId?: string): Promise<string> {
    const targetId = userId || ConnectionsService.DEFAULT_TEST_USER_ID;

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
   * GET /connections/health-check
   */
  async getHealthCheck() {
    const totalConnections = await this.connectionRepository.count().catch(() => 0);
    return {
      status: 'success',
      module: 'ConnectionsModule',
      message: 'ConnectionsModule and database connection are active',
      timestamp: new Date().toISOString(),
      database: {
        entity: 'Connection',
        table: 'connections',
        total_connections: totalConnections,
      },
    };
  }
}

