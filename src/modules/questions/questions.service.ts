import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Question } from "./entities/question.entity";
import { Answer } from "./entities/answer.entity";
import { CreateQuestionDto, UpdateQuestionDto, CreateAnswerDto, UpdateAnswerDto } from "./dto/question.dto";

@Injectable()
export class QuestionsService {
constructor
(@InjectRepository(Question)
private readonly questionRepository: Repository<Question>,
@InjectRepository(Answer)
private readonly answerRepository: Repository<Answer>,
private dataSource: DataSource,
){}

async getQuestions(search?: string, unanswered?: string){
    try{
        const qb = this.questionRepository.createQueryBuilder("q").leftJoinAndSelect("q.author", "author");
        
        if(search) qb.andWhere("(q.title ILIKE :s OR q.content ILIKE :s)", { s: `%${search}%` });
        if(unanswered === "true") qb.andWhere("NOT EXISTS (SELECT 1 FROM answers a WHERE a.question_id = q.id AND a.deleted_at IS NULL)");
        
        qb.orderBy("q.created_at", "DESC");
        const questions = await qb.getMany();
        return questions;
    }
    catch (error){
        throw error;
    }
}

async createQuestion(userId: string, dto: CreateQuestionDto){
    try{
        const responce = await this.questionRepository.create({ ...dto, authorId: userId });
        return await this.questionRepository.save(responce);
    }
    catch(error){
        throw error;
    }
}

async updateQuestion (id: string, userId: string, dto: UpdateQuestionDto){
    try{
        console.log("id",id);
        if(!id)
        {
            throw new NotFoundException("Question not found");
        }
        const question= await this.questionRepository.findOne(
            {
                where: {
                    id:id,
                },
            }        );
            if(!question){
                throw new NotFoundException("Question not found");
            }
            if(question.authorId !== userId){
                throw new ForbiddenException("You can only update your own questions");
            }
            Object.assign(question,dto);
            const{id: uid, ...rest } =question  ;
            return await this.questionRepository.update({id:id}, rest);
    } catch (error){
        throw error;
    }
}

async deleteQuestion(id: string, userId: string){
    try{
        const question = await this.questionRepository.findOne({
            where: {
                id:id,
            },
        });
        if (!question) {
            throw new NotFoundException("Question not found");
        }
        if(question.authorId !== userId){
            throw new ForbiddenException("You can only delete your own questions");
        }
        return await this.questionRepository.softDelete({ id:id });
    } catch (error) {
        throw error;
    }
}

async createAnswer(questionId: string, userId: string, dto: CreateAnswerDto){
    try{
        const question = await this.questionRepository.findOne({ where: { id: questionId } });
        if(!question) throw new NotFoundException("Question not found");
        
        const responce = await this.answerRepository.create({ ...dto, questionId: questionId, authorId: userId });
        return await this.answerRepository.save(responce);
    }
    catch(error){
        throw error;
    }
}

async updateAnswer (id: string, userId: string, dto: UpdateAnswerDto){
    try{
        console.log("answer id",id);
        if(!id)
        {
            throw new NotFoundException("Answer not found");
        }
        const answer= await this.answerRepository.findOne(
            {
                where: {
                    id:id,
                },
            }        );
            if(!answer){
                throw new NotFoundException("Answer not found");
            }
            if(answer.authorId !== userId){
                throw new ForbiddenException("You can only update your own answer");
            }
            Object.assign(answer,dto);
            const{id: uid, ...rest } =answer  ;
            return await this.answerRepository.update({id:id}, rest);
    } catch (error){
        throw error;
    }
}

async acceptAnswer(questionId: string, answerId: string, userId: string){
    try{
        const question = await this.questionRepository.findOne({ where: { id: questionId } });
        if(!question) throw new NotFoundException("Question not found");
        if(question.authorId !== userId) throw new ForbiddenException("Only the author can accept an answer");

        const answer = await this.answerRepository.findOne({ where: { id: answerId, questionId: questionId } });
        if(!answer) throw new NotFoundException("Answer not found");

        await this.answerRepository.update({ questionId: questionId, isAccepted: true }, { isAccepted: false });
        answer.isAccepted = true;
        return await this.answerRepository.save(answer);
    }
    catch(error){
        throw error;
    }
}
}