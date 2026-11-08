import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';

export class CreateUniversityTables1793425090000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Faculties table
    await queryRunner.createTable(
      new Table({
        name: 'faculties',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '120',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '20',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // 2. Academic Programs table
    await queryRunner.createTable(
      new Table({
        name: 'academic_programs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'faculty_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'degree_level',
            type: 'varchar',
            length: '30',
            default: "'undergraduate'",
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['faculty_id'],
            referencedTableName: 'faculties',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Unique constraint: one program name + degree_level per faculty
    await queryRunner.createUniqueConstraint(
      'academic_programs',
      new TableUnique({
        name: 'UQ_faculty_program_degree',
        columnNames: ['faculty_id', 'name', 'degree_level'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('academic_programs');
    await queryRunner.dropTable('faculties');
  }
}
