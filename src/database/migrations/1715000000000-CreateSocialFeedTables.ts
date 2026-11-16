import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSocialFeedTables1715000000000 implements MigrationInterface {
  name = 'CreateSocialFeedTables1715000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Enable uuid-ossp extension for UUID generation
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

    // 3. PostgreSQL Enums (using DO blocks to prevent duplicate errors)
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "feed_posts_visibility_enum" AS ENUM('community');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "post_media_media_type_enum" AS ENUM('image', 'video');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "reactions_reaction_type_enum" AS ENUM('like', 'love', 'support', 'insightful');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // 4. Create feed_posts table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "feed_posts" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "author_id" UUID NOT NULL,
        "content" TEXT NULL,
        "visibility" "feed_posts_visibility_enum" NOT NULL DEFAULT 'community',
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP NULL,
        CONSTRAINT "FK_feed_posts_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 5. Create post_media table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "post_media" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "post_id" UUID NOT NULL,
        "media_type" "post_media_media_type_enum" NOT NULL,
        "file_url" VARCHAR(500) NOT NULL,
        "mime_type" VARCHAR(100) NOT NULL,
        "file_size_bytes" BIGINT NOT NULL,
        "sort_order" INT NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_post_media_post" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE
      );
    `);

    // 6. Create comments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "post_id" UUID NOT NULL,
        "author_id" UUID NOT NULL,
        "content" TEXT NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMP NULL,
        CONSTRAINT "FK_comments_post" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_comments_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
      );
    `);

    // 7. Create reactions table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "reactions" (
        "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "post_id" UUID NOT NULL,
        "user_id" UUID NOT NULL,
        "reaction_type" "reactions_reaction_type_enum" NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "FK_reactions_post" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_reactions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_reactions_post_user" UNIQUE ("post_id", "user_id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "reactions";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "comments";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "post_media";`);
    await queryRunner.query(`DROP TABLE IF EXISTS "feed_posts";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "reactions_reaction_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "post_media_media_type_enum";`);
    await queryRunner.query(`DROP TYPE IF EXISTS "feed_posts_visibility_enum";`);
  }
}

