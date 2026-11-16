import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateAcademicResourcesTables1793425200001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    
    await queryRunner.query(`CREATE TYPE "note_resources_status_enum" AS ENUM ('available', 'hidden')`);

   
    await queryRunner.createTable(
      new Table({
        name: 'note_resources',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'uploader_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '180',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'course',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'semester',
            type: 'varchar',
            length: '40',
            isNullable: true,
          },
          {
            name: 'file_url',
            type: 'varchar',
            length: '500',
            isNullable: false,
          },
          {
            name: 'mime_type',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'file_size_bytes',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enumName: 'note_resources_status_enum',
            default: "'available'",
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
        foreignKeys: [
          {
            columnNames: ['uploader_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('note_resources');
    await queryRunner.query(`DROP TYPE "note_resources_status_enum"`);
  }
}