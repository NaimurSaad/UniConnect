import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { AcademicProgram } from '@/modules/university/entities/academic-program.entity';

@Entity({ name: 'student_profiles' })
export class StudentProfile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId!: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'student_id', length: 30, unique: true })
    studentId!: string;

    @Column({ name: 'program_id', type: 'int' })
    programId!: number;

    @ManyToOne(() => AcademicProgram, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'program_id' })
    program!: AcademicProgram;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}