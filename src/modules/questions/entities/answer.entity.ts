import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Question } from "./question.entity";

@Entity({name:"answers"})
export class Answer {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ name: "question_id", type: "uuid" })
    questionId!: string;

    @ManyToOne(() => Question, (question) => question.answers, { onDelete: "CASCADE" })
    @JoinColumn({ name: "question_id" })
    question!: Question;

    @Column({ name: "author_id", type: "uuid" })
    authorId!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: "author_id" })
    author!: User;

    @Column({ type: "text" })
    content!: string;

    @Column({ name: "is_accepted", default: false })
    isAccepted!: boolean;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    @DeleteDateColumn()
    deleted_at?: Date;
}