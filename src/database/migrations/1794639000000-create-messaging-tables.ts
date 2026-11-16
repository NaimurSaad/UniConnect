import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateMessagingTables1794639000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.createTable(
            new Table({
                name: 'conversations',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'conversation_type', type: 'varchar', length: '10', isNullable: false },
                    { name: 'title', type: 'varchar', length: '120', isNullable: true },
                    { name: 'created_by', type: 'uuid', isNullable: false },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey('conversations', new TableForeignKey({
            columnNames: ['created_by'], referencedColumnNames: ['id'], referencedTableName: 'users', onDelete: 'CASCADE',
        }));

        await queryRunner.createTable(
            new Table({
                name: 'conversation_participants',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'conversation_id', type: 'uuid', isNullable: false },
                    { name: 'user_id', type: 'uuid', isNullable: false },
                    { name: 'joined_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                    { name: 'last_read_at', type: 'timestamp', isNullable: true },
                ],
                uniques: [{ columnNames: ['conversation_id', 'user_id'] }],
            }),
            true,
        );

        await queryRunner.createForeignKey('conversation_participants', new TableForeignKey({
            columnNames: ['conversation_id'], referencedColumnNames: ['id'], referencedTableName: 'conversations', onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('conversation_participants', new TableForeignKey({
            columnNames: ['user_id'], referencedColumnNames: ['id'], referencedTableName: 'users', onDelete: 'CASCADE',
        }));


        await queryRunner.createTable(
            new Table({
                name: 'messages',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'conversation_id', type: 'uuid', isNullable: false },
                    { name: 'sender_id', type: 'uuid', isNullable: false },
                    { name: 'content', type: 'text', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                    { name: 'edited_at', type: 'timestamp', isNullable: true },
                    { name: 'deleted_at', type: 'timestamp', isNullable: true },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey('messages', new TableForeignKey({
            columnNames: ['conversation_id'], referencedColumnNames: ['id'], referencedTableName: 'conversations', onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('messages', new TableForeignKey({
            columnNames: ['sender_id'], referencedColumnNames: ['id'], referencedTableName: 'users', onDelete: 'CASCADE',
        }));

        await queryRunner.createTable(
            new Table({
                name: 'message_attachments',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'message_id', type: 'uuid', isNullable: false },
                    { name: 'media_type', type: 'varchar', length: '10', isNullable: false },
                    { name: 'file_url', type: 'varchar', length: '500', isNullable: false },
                    { name: 'mime_type', type: 'varchar', length: '100', isNullable: false },
                    { name: 'file_size_bytes', type: 'bigint', isNullable: false },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey('message_attachments', new TableForeignKey({
            columnNames: ['message_id'], referencedColumnNames: ['id'], referencedTableName: 'messages', onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('message_attachments', true);
        await queryRunner.dropTable('messages', true);
        await queryRunner.dropTable('conversation_participants', true);
        await queryRunner.dropTable('conversations', true);
    }
}