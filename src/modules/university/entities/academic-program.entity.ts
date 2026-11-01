import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DegreeLevel } from '@/common/enums/degree-level.enum';
import { Department } from './department.entity';

@Entity({ name: 'academic_programs' })
@Unique(['departmentId', 'name', 'degreeLevel'])
export class AcademicProgram {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'department_id' })
  departmentId!: number;

  @ManyToOne(() => Department, (department) => department.programs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department!: Department;

  @Column({ length: 150 })
  name!: string;

  @Column({ name: 'degree_level', type: 'varchar', length: 30, default: DegreeLevel.UNDERGRADUATE })
  degreeLevel!: DegreeLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
