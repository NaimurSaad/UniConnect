import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AcademicProgram } from './academic-program.entity';

@Entity({ name: 'faculties' })
export class Faculty {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 120, unique: true })
  name!: string;

  @Column({ length: 20, unique: true })
  code!: string;

  @OneToMany(() => AcademicProgram, (program) => program.faculty)
  programs!: AcademicProgram[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
