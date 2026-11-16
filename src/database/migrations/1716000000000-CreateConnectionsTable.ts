import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConnectionsTable1716000000000 implements MigrationInterface {
  name = 'CreateConnectionsTable1716000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Enable uuid-ossp extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // 2. Ensure stub users table exists so foreign keys do not fail
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "full_name" VARCHAR(120) NOT NULL,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password_hash" VARCHAR(255) NOT NULL,
        "account_status" VARCHAR(50) NOT NULL DEFAULT 'active',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Create enum for connection status
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "connections_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'blocked');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 4. Create connections table with constraints
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "connections" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "requester_id" UUID NOT NULL,
        "receiver_id" UUID NOT NULL,
        "status" "connections_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "CHK_connections_not_self" CHECK ("requester_id" <> "receiver_id"),
        CONSTRAINT "UQ_connections_pair" UNIQUE ("requester_id", "receiver_id"),
        CONSTRAINT "FK_connections_requester" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_connections_receiver" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 5. Create index for faster lookup on requester_id, receiver_id, and status
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_connections_requester_id" ON "connections" ("requester_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_connections_receiver_id" ON "connections" ("receiver_id");
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "IDX_connections_status" ON "connections" ("status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "connections";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "connections_status_enum";`);
  }
}

