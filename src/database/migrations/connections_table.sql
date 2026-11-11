-- =====================================================================
-- UniConnect - Connections Module Database Table (Student 2)
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

-- 3. PostgreSQL Enums for Connection Status
DO $$ BEGIN
    CREATE TYPE "connections_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'blocked');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 4. Connections Table
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

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS "IDX_connections_requester_id" ON "connections" ("requester_id");
CREATE INDEX IF NOT EXISTS "IDX_connections_receiver_id" ON "connections" ("receiver_id");
CREATE INDEX IF NOT EXISTS "IDX_connections_status" ON "connections" ("status");

