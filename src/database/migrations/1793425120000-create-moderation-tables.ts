import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateModerationTables1793425120000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. content reports
        await queryRunner.createTable(
            new Table({
                name: 'content_reports',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'reporter_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'target_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'target_id',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'reason',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '20',
                        default: "'pending'",
                        isNullable: false,
                    },
                    {
                        name: 'reviewed_by',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'reviewed_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'content_reports',
            new TableForeignKey({
                columnNames: ['reporter_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'content_reports',
            new TableForeignKey({
                columnNames: ['reviewed_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }),
        );

        // 2. moderation actions
        await queryRunner.createTable(
            new Table({
                name: 'moderation_actions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'moderator_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'target_user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'report_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'action_type',
                        type: 'varchar',
                        length: '20',
                        isNullable: false,
                    },
                    {
                        name: 'reason',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'moderation_actions',
            new TableForeignKey({
                columnNames: ['moderator_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }),
        );

        await queryRunner.createForeignKey(
            'moderation_actions',
            new TableForeignKey({
                columnNames: ['target_user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'moderation_actions',
            new TableForeignKey({
                columnNames: ['report_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'content_reports',
                onDelete: 'SET NULL',
            }),
        );

        // 3. audit logs
        await queryRunner.createTable(
            new Table({
                name: 'audit_logs',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'actor_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'actor_name',
                        type: 'varchar',
                        length: '120',
                        isNullable: true,
                    },
                    {
                        name: 'action',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'entity_name',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                    },
                    {
                        name: 'entity_id',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'details',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'ip_address',
                        type: 'varchar',
                        length: '45',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'audit_logs',
            new TableForeignKey({
                columnNames: ['actor_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('audit_logs', true);
        await queryRunner.dropTable('moderation_actions', true);
        await queryRunner.dropTable('content_reports', true);
    }
}