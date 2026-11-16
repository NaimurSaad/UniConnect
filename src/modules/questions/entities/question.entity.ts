import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Answer } from "./answer.entity";

@Entity({name:"questions"})
export class Question {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "author_id", type: "uuid" })
    authorId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "author_id" })
    author!: User;

    @Column()
    title!: string;

    @Column({ type: "text" })
    content!: string;

    @OneToMany(() => Answer, (answer) => answer.question)
    answers!: Answer[];

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}