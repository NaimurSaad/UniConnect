import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from './entities/connection.entity';
import { User } from '../users/entities/user.entity';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { RequireUserGuard } from '../../common/guards/require-user.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Connection, User])],
  controllers: [ConnectionsController],
  providers: [ConnectionsService, RequireUserGuard],
  exports: [ConnectionsService, TypeOrmModule],
})
export class ConnectionsModule {}
