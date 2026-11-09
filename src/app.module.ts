import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresDatabaseProviderModule } from '@/providers/database/postgres/provider.module';
import { AppController } from '@/src/app.controller';
import { AppService } from '@/src/app.service';
import global_config from '@/config/global_config';
import { BullModule } from '@nestjs/bull';
import { UserModule } from '@/modules/user/user.module';
import { UniversityModule } from '@/modules/university/university.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { AffiliationModule } from '@/modules/affiliation/affiliation.module';
import { ModerationModule } from '@/modules/moderation/moderation.module';


@Module({
  imports: [
    PostgresDatabaseProviderModule,
    UserModule,
    UniversityModule,
    AuthModule,
    AffiliationModule,
    ModerationModule,

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
