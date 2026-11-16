import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseProviderModule } from '@/providers/database/postgres/provider.module';
import { AppController } from '@/src/app.controller';
import { AppService } from '@/src/app.service';
import global_config from '@/config/global_config';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from '@/modules/user/user.module';
import { UniversityModule } from '@/modules/university/university.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { AffiliationModule } from '@/modules/affiliation/affiliation.module';
import { ModerationModule } from '@/modules/moderation/moderation.module';
import { ProjectModule } from '@/modules/project/project.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { AcademicResourcesModule } from './modules/academic-resources/academic-resources.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { BloodDonationModule } from './modules/blood-donation/blood-donation.module';
import { LostAndFoundModule } from './modules/lost-and-found/lost-and-found.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { SocialFeedModule } from './modules/social-feed/social-feed.module';
import { ConnectionsModule } from './modules/connections/connections.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    PostgresDatabaseProviderModule,
    UserModule,
    UniversityModule,
    AuthModule,
    AffiliationModule,
    ModerationModule,
    ProjectModule,
    JobsModule,
    AcademicResourcesModule,
    QuestionsModule,
    BloodDonationModule,
    LostAndFoundModule,
    MessagingModule,
    SocialFeedModule,
    ConnectionsModule,
    NotificationsModule,

    ConfigModule.forRoot({
      isGlobal: true,
      load: [],
    }),
    BullModule.forRoot({
      url: process.env.REDIS_URL,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [global_config],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }