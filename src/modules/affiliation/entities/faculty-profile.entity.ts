import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Faculty } from '@/modules/university/entities/faculty.entity';

@Entity({ name: 'faculty_profiles' })
export class FacultyProfile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'user_id', type: 'uuid', unique: true })
    userId!: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ name: 'faculty_id', type: 'int', nullable: true })
    facultyId?: number;

    @ManyToOne(() => Faculty, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'faculty_id' })
    faculty?: Faculty;

    @Column({ length: 100 })
    designation!: string;

    @Column({ name: 'official_email', length: 255 })
    officialEmail!: string;

    @Column({ name: 'office_room', length: 50, nullable: true })
    officeRoom?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}