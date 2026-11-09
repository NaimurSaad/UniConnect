import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { AcademicProgram } from '@/modules/university/entities/academic-program.entity';

@Entity({ name: 'alumni_profiles' })
export class AlumniProfile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId!: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'program_id', type: 'int', nullable: true })
    programId?: number;

    @ManyToOne(() => AcademicProgram, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'program_id' })
    program?: AcademicProgram;

    @Column({ name: 'graduation_year', type: 'int' })
    graduationYear!: number;

    @Column({ name: 'current_company', length: 120, nullable: true })
    currentCompany?: string;

    @Column({ name: 'current_job_title', length: 100, nullable: true })
    currentJobTitle?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}