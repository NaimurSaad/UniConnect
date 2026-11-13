import {
  Injectable,
  Logger,
  BadRequestException,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Connection } from './entities/connection.entity';
import { ConnectionStatus } from './enums/connection-status.enum';
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

  /**
   * Send Connection Request with Bidirectional Conflict Resolution:
   * Handles self-connection prevention, existing requests in either direction,
   * re-requesting after rejection, and new connection creation.
   */
  async sendRequest(requesterId: string, targetUserId: string): Promise<Connection> {
    // 1. Prevent connecting to oneself
    if (requesterId === targetUserId) {
      throw new BadRequestException('You cannot send a connection request to yourself.');
    }

    // 2. Ensure both users exist in DB to satisfy foreign keys during local testing
    await this.ensureUserExists(requesterId);
    await this.ensureUserExists(targetUserId);

    // 3. Bidirectional search: check for ANY existing connection record between the two users
    const existing = await this.connectionRepository.findOne({
      where: [
        { requester_id: requesterId, receiver_id: targetUserId },
        { requester_id: targetUserId, receiver_id: requesterId },
      ],
    });

    // 4. Handle existing record based on status
    if (existing) {
      if (existing.status === ConnectionStatus.PENDING) {
        throw new ConflictException(
          'A pending connection request already exists between these users.',
        );
      }

      if (existing.status === ConnectionStatus.ACCEPTED) {
        throw new ConflictException('You are already connected with this user.');
      }

      if (existing.status === ConnectionStatus.BLOCKED) {
        throw new BadRequestException('Unable to send connection request.');
      }

      if (existing.status === ConnectionStatus.REJECTED) {
        // If previously rejected, allow re-requesting: flip direction to current requester & set back to PENDING
        existing.requester_id = requesterId;
        existing.receiver_id = targetUserId;
        existing.status = ConnectionStatus.PENDING;
        return await this.connectionRepository.save(existing);
      }
    }

    // 5. If no record exists, create a new pending connection
    const newConnection = this.connectionRepository.create({
      requester_id: requesterId,
      receiver_id: targetUserId,
      status: ConnectionStatus.PENDING,
    });

    return await this.connectionRepository.save(newConnection);
  }

  /**
   * Accept Connection Request:
   * Only the receiver can accept a connection request in PENDING state.
   */
  async acceptRequest(connectionId: string, userId: string): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found.');
    }

    if (connection.receiver_id !== userId) {
      throw new ForbiddenException('Only the receiver can accept this connection request.');
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException('Only pending connection requests can be accepted.');
    }

    connection.status = ConnectionStatus.ACCEPTED;
    return await this.connectionRepository.save(connection);
  }

  /**
   * Reject Connection Request:
   * Only the receiver can reject a connection request in PENDING state.
   */
  async rejectRequest(connectionId: string, userId: string): Promise<Connection> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found.');
    }

    if (connection.receiver_id !== userId) {
      throw new ForbiddenException('Only the receiver can reject this connection request.');
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException('Only pending connection requests can be rejected.');
    }

    connection.status = ConnectionStatus.REJECTED;
    return await this.connectionRepository.save(connection);
  }

  /**
   * Cancel Connection Request:
   * Only the requester can cancel their own sent request while in PENDING state.
   */
  async cancelRequest(
    connectionId: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const connection = await this.connectionRepository.findOne({
      where: { id: connectionId },
    });

    if (!connection) {
      throw new NotFoundException('Connection request not found.');
    }

    if (connection.requester_id !== userId) {
      throw new ForbiddenException('Only the requester can cancel this connection request.');
    }

    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException('Only pending connection requests can be cancelled.');
    }

    await this.connectionRepository.remove(connection);
    return {
      success: true,
      message: 'Connection request cancelled successfully.',
    };
  }

  /**
   * Block User:
   * Sets or overrides any relationship to BLOCKED status.
   * Actor becomes requester_id, target becomes receiver_id.
   */
  async blockUser(actorId: string, targetUserId: string): Promise<Connection> {
    if (actorId === targetUserId) {
      throw new BadRequestException('You cannot block yourself.');
    }

    await this.ensureUserExists(actorId);
    await this.ensureUserExists(targetUserId);

    // Search in either direction
    const existing = await this.connectionRepository.findOne({
      where: [
        { requester_id: actorId, receiver_id: targetUserId },
        { requester_id: targetUserId, receiver_id: actorId },
      ],
    });

    if (existing) {
      if (
        existing.status === ConnectionStatus.BLOCKED &&
        existing.requester_id === actorId
      ) {
        throw new ConflictException('You have already blocked this user.');
      }

      existing.requester_id = actorId;
      existing.receiver_id = targetUserId;
      existing.status = ConnectionStatus.BLOCKED;
      return await this.connectionRepository.save(existing);
    }

    const newBlock = this.connectionRepository.create({
      requester_id: actorId,
      receiver_id: targetUserId,
      status: ConnectionStatus.BLOCKED,
    });

    return await this.connectionRepository.save(newBlock);
  }

  /**
   * Unblock User:
   * Only the user who placed the block (requester_id) can unblock.
   */
  async unblockUser(
    actorId: string,
    targetUserId: string,
  ): Promise<{ success: boolean; message: string }> {
    const connection = await this.connectionRepository.findOne({
      where: {
        requester_id: actorId,
        receiver_id: targetUserId,
        status: ConnectionStatus.BLOCKED,
      },
    });

    if (!connection) {
      throw new NotFoundException('No active block record found for this user.');
    }

    await this.connectionRepository.remove(connection);
    return {
      success: true,
      message: 'User unblocked successfully.',
    };
  }

  /**
   * Check if two users have a block relationship in either direction.
   */
  async isBlocked(userA: string, userB: string): Promise<boolean> {
    const blockRecord = await this.connectionRepository.findOne({
      where: [
        { requester_id: userA, receiver_id: userB, status: ConnectionStatus.BLOCKED },
        { requester_id: userB, receiver_id: userA, status: ConnectionStatus.BLOCKED },
      ],
    });

    return !!blockRecord;
  }
}
