import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNotificationsTable1793425320000 implements MigrationInterface {
  name = 'CreateNotificationsTable1793425320000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Enable uuid-ossp extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 2. Create notifications table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "user_id" UUID NOT NULL,
        "notification_type" VARCHAR(60) NOT NULL,
        "message" VARCHAR(500) NOT NULL,
        "related_entity_type" VARCHAR(60) NULL,
        "related_entity_id" UUID NULL,
        "read_at" TIMESTAMP NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 4. Create composite index for fast unread notification queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_notifications_user_read" ON "notifications" ("user_id", "read_at");
    `);

    // 5. Index for reverse chronological order queries
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_notifications_user_created" ON "notifications" ("user_id", "created_at" DESC);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications";`);
  }
}

