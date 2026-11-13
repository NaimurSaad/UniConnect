import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateJobsTables1793425200000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`CREATE TYPE "job_posts_job_type_enum" AS ENUM ('job', 'internship')`);
        await queryRunner.query(`CREATE TYPE "job_posts_status_enum" AS ENUM ('open', 'closed', 'draft')`);
        await queryRunner.query(`CREATE TYPE "job_applications_status_enum" AS ENUM ('submitted', 'reviewing', 'shortlisted', 'rejected', 'accepted', 'withdrawn')`);

        
        await queryRunner.createTable(
            new Table({
                name: "job_posts",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "author_id", type: "uuid", isNullable: false },
                    { name: "title", type: "varchar", length: "180", isNullable: false },
                    { name: "organization", type: "varchar", length: "180", isNullable: false },
                    { name: "job_type", type: "enum", enumName: "job_posts_job_type_enum", isNullable: false },
                    { name: "description", type: "text", isNullable: false },
                    { name: "location", type: "varchar", length: "180", isNullable: true },
                    { name: "application_url", type: "varchar", length: "500", isNullable: true },
                    { name: "deadline", type: "timestamp", isNullable: true },
                    { name: "status", type: "enum", enumName: "job_posts_status_enum", default: "'open'", isNullable: false },
                    { name: "created_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                    { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "job_posts",
            new TableForeignKey({
                columnNames: ["author_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        );

        
        await queryRunner.createTable(
            new Table({
                name: "job_applications",
                columns: [
                    { name: "id", type: "uuid", isPrimary: true, generationStrategy: "uuid", default: "uuid_generate_v4()" },
                    { name: "job_post_id", type: "uuid", isNullable: false },
                    { name: "applicant_id", type: "uuid", isNullable: false },
                    { name: "cover_letter", type: "text", isNullable: true },
                    { name: "resume_url", type: "varchar", length: "500", isNullable: true },
                    { name: "status", type: "enum", enumName: "job_applications_status_enum", default: "'submitted'", isNullable: false },
                    { name: "applied_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                    { name: "updated_at", type: "timestamp", default: "CURRENT_TIMESTAMP" },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            "job_applications",
            new TableForeignKey({
                columnNames: ["job_post_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "job_posts",
                onDelete: "CASCADE",
            }),
        );
        await queryRunner.createForeignKey(
            "job_applications",
            new TableForeignKey({
                columnNames: ["applicant_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            }),
        );
        await queryRunner.createIndex(
            "job_applications",
            new TableIndex({
                name: "IDX_JOB_APPLICATIONS_POST_APPLICANT",
                columnNames: ["job_post_id", "applicant_id"],
                isUnique: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("job_applications");
        await queryRunner.dropTable("job_posts");
        await queryRunner.query(`DROP TYPE "job_applications_status_enum"`);
        await queryRunner.query(`DROP TYPE "job_posts_status_enum"`);
        await queryRunner.query(`DROP TYPE "job_posts_job_type_enum"`);
    }
}