import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateLostFoundTable1794638000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'lost_found_posts',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'author_id', type: 'uuid', isNullable: false },
                    { name: 'post_type', type: 'varchar', length: '10', isNullable: false },
                    { name: 'item_category', type: 'varchar', length: '100', isNullable: false },
                    { name: 'title', type: 'varchar', length: '180', isNullable: false },
                    { name: 'description', type: 'text', isNullable: false },
                    { name: 'location', type: 'varchar', length: '180', isNullable: true },
                    { name: 'event_date', type: 'date', isNullable: true },
                    { name: 'image_url', type: 'varchar', length: '500', isNullable: true },
                    { name: 'status', type: 'varchar', length: '20', default: "'active'", isNullable: false },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey('lost_found_posts', new TableForeignKey({
            columnNames: ['author_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('lost_found_posts', true);
    }
}