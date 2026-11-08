import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { DegreeLevel } from '@/common/enums/degree-level.enum';
import { Faculty } from './faculty.entity';

@Entity({ name: 'academic_programs' })
@Unique(['facultyId', 'name', 'degreeLevel'])
export class AcademicProgram {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'faculty_id' })
  facultyId!: number;

  @ManyToOne(() => Faculty, (faculty) => faculty.programs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'faculty_id' })
  faculty!: Faculty;

  @Column({ length: 150 })
  name!: string;

  @Column({ name: 'degree_level', type: 'varchar', length: 30, default: DegreeLevel.UNDERGRADUATE })
  degreeLevel!: DegreeLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
