import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBloodResponseTable1794637000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'blood_responses',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'request_id', type: 'uuid', isNullable: false },
                    { name: 'donor_id', type: 'uuid', isNullable: false },
                    { name: 'message', type: 'varchar', length: '500', isNullable: true },
                    { name: 'status', type: 'varchar', length: '20', default: "'offered'", isNullable: false },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', isNullable: false },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey('blood_responses', new TableForeignKey({
            columnNames: ['request_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'blood_requests',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('blood_responses', new TableForeignKey({
            columnNames: ['donor_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'users',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('blood_responses', true);
    }
}