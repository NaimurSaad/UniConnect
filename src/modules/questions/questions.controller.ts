import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, Query, ParseUUIDPipe } from "@nestjs/common";
import { QuestionsService } from "./questions.service";
import { CreateQuestionDto, UpdateQuestionDto, CreateAnswerDto, UpdateAnswerDto } from "./dto/question.dto"; 
import { JwtGuard } from "../../common/guard/jwt.guard";

@Controller("questions")
@UseGuards(JwtGuard)
export class QuestionsController {
    constructor(private readonly questionsService: QuestionsService) {}

    @Get()
    async getQuestions(
        @Query("search") search?: string,
        @Query("unanswered") unanswered?: string
    ) {
        return await this.questionsService.getQuestions(search, unanswered);
    }

    @Post()
    async createQuestion(@Req() req: any, @Body(ValidationPipe) dto: CreateQuestionDto) {
        return await this.questionsService.createQuestion(req.user.user_id, dto);
    }
    
    @Patch(":id")
    async updateQuestion(
        @Param("id", ParseUUIDPipe) id: string, 
        @Req() req: any, 
        @Body(ValidationPipe) dto: UpdateQuestionDto 
    ) {    
        return await this.questionsService.updateQuestion(id, req.user.user_id, dto);
    }

    @Delete(":id")
    async deleteQuestion(@Param("id", ParseUUIDPipe) id: string, @Req() req: any) {
        return await this.questionsService.deleteQuestion(id, req.user.user_id);
    }

    @Post(":id/answers")
    async createAnswer(
        @Param("id", ParseUUIDPipe) id: string, 
        @Req() req: any, 
        @Body(ValidationPipe) dto: CreateAnswerDto
    ) {
        return await this.questionsService.createAnswer(id, req.user.user_id, dto);
    }

    @Patch("answers/:answerId")
    async updateAnswer(
        @Param("answerId", ParseUUIDPipe) answerId: string, 
        @Req() req: any, 
        @Body(ValidationPipe) dto: UpdateAnswerDto
    ) {
        return await this.questionsService.updateAnswer(answerId, req.user.user_id, dto);
    }

    @Post(":id/answers/:answerId/accept")
    async acceptAnswer(
        @Param("id", ParseUUIDPipe) id: string, 
        @Param("answerId", ParseUUIDPipe) answerId: string, 
        @Req() req: any
    ) {
        return await this.questionsService.acceptAnswer(id, answerId, req.user.user_id);
    }
}