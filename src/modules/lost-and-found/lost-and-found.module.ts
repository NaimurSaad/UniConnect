import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostFoundPost } from './entities/lost-found-post.entity';
import { LostAndFoundService } from './lost-and-found.service';
import { LostAndFoundController } from './lost-and-found.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LostFoundPost])],
  controllers: [LostAndFoundController],
  providers: [LostAndFoundService],
  exports: [LostAndFoundService],
})
export class LostAndFoundModule {}