-- =====================================================================
-- UniConnect - Social Feed Module Database Tables (Student 2)
-- PostgreSQL DDL Script for pgAdmin / psql
-- =====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Stub Users Table (Student 1 Domain) - prevents FK errors if not yet migrated
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255) NOT NULL UNIQUE,
    "password_hash" VARCHAR(255) NOT NULL,
    "account_status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. PostgreSQL Enums
DO $$ BEGIN
    CREATE TYPE "feed_posts_visibility_enum" AS ENUM('community');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "post_media_media_type_enum" AS ENUM('image', 'video');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "reactions_reaction_type_enum" AS ENUM('like', 'love', 'support', 'insightful');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. FeedPost Table
CREATE TABLE IF NOT EXISTS "feed_posts" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "author_id" UUID NOT NULL,
    "content" TEXT NULL,
    "visibility" "feed_posts_visibility_enum" NOT NULL DEFAULT 'community',
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP NULL,
    CONSTRAINT "fk_feed_posts_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- 5. PostMedia Table
CREATE TABLE IF NOT EXISTS "post_media" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "post_id" UUID NOT NULL,
    "media_type" "post_media_media_type_enum" NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "file_size_bytes" BIGINT NOT NULL,
    "sort_order" INT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_post_media_post" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE
);

-- 6. Comment Table
CREATE TABLE IF NOT EXISTS "comments" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "post_id" UUID NOT NULL,
    "author_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP NULL,
    CONSTRAINT "fk_comments_post" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_comments_author" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE
);

-- 7. Reaction Table
CREATE TABLE IF NOT EXISTS "reactions" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "post_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "reaction_type" "reactions_reaction_type_enum" NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "fk_reactions_post" FOREIGN KEY ("post_id") REFERENCES "feed_posts"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_reactions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
    CONSTRAINT "uq_reactions_post_user" UNIQUE ("post_id", "user_id")
);

