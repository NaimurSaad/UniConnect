import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAffiliationTables1793425110000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. student_profiles
        await queryRunner.createTable(
            new Table({
                name: 'student_profiles',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'student_id',
                        type: 'varchar',
                        length: '30',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'program_id',
                        type: 'int',
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
            'student_profiles',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'student_profiles',
            new TableForeignKey({
                columnNames: ['program_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'academic_programs',
                onDelete: 'SET NULL',
            }),
        );

        // 2. faculty_profiles
        await queryRunner.createTable(
            new Table({
                name: 'faculty_profiles',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'faculty_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'designation',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'official_email',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'office_room',
                        type: 'varchar',
                        length: '50',
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
            'faculty_profiles',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'faculty_profiles',
            new TableForeignKey({
                columnNames: ['faculty_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'faculties',
                onDelete: 'SET NULL',
            }),
        );

        // 3. alumni_profiles
        await queryRunner.createTable(
            new Table({
                name: 'alumni_profiles',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'program_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'graduation_year',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'current_company',
                        type: 'varchar',
                        length: '120',
                        isNullable: true,
                    },
                    {
                        name: 'current_job_title',
                        type: 'varchar',
                        length: '100',
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
            'alumni_profiles',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'alumni_profiles',
            new TableForeignKey({
                columnNames: ['program_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'academic_programs',
                onDelete: 'SET NULL',
            }),
        );

        // 4. affiliation_requests
        await queryRunner.createTable(
            new Table({
                name: 'affiliation_requests',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'affiliation_type',
                        type: 'varchar',
                        length: '20',
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
            'affiliation_requests',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'CASCADE',
            }),
        );

        await queryRunner.createForeignKey(
            'affiliation_requests',
            new TableForeignKey({
                columnNames: ['reviewed_by'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('affiliation_requests', true);
        await queryRunner.dropTable('alumni_profiles', true);
        await queryRunner.dropTable('faculty_profiles', true);
        await queryRunner.dropTable('student_profiles', true);
    }
}