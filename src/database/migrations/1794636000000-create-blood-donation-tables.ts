import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBloodDonationTables1794636000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. blood_requests table
        await queryRunner.createTable(
            new Table({
                name: 'blood_requests',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'requester_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'blood_group',
                        type: 'varchar',
                        length: '10',
                        isNullable: false,
                    },
                    {
                        name: 'units',
                        type: 'smallint',
                        default: 1,
                        isNullable: false,
                    },
                    {
                        name: 'hospital',
                        type: 'varchar',
                        length: '180',
                        isNullable: false,
                    },
                    {
                        name: 'location',
                        type: 'varchar',
                        length: '180',
                        isNullable: true,
                    },
                    {
                        name: 'needed_by',
                        type: 'timestamp',
                        isNullable: false,
                    },
                    {
                        name: 'contact_info',
                        type: 'varchar',
                        length: '180',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '20',
                        default: "'open'",
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        isNullable: false,
                    },
                ],
            }),
            true,
        );
        
        await queryRunner.createForeignKey(
            'blood_requests',
            new TableForeignKey({
                columnNames: ['requester_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('blood_requests', true);
    }
}