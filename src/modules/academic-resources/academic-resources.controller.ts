import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Req, UseGuards, Query } from "@nestjs/common";
import { AcademicResourcesService } from "./academic-resources.service";
import { CreateResourceDto, UpdateResourceDto } from "./dto/resource.dto"; 
import { JwtGuard } from "../../common/guard/jwt.guard";

@Controller("academic-resources") 
@UseGuards(JwtGuard)
export class AcademicResourcesController {
    constructor(private readonly resourcesService: AcademicResourcesService) {}

    @Get()
    async getResources(
        @Query("search") search?: string,
        @Query("course") course?: string,
        
    ) {
        return await this.resourcesService.getResources(search, course);
    }

    @Post()
    async createResource(@Req() req: any, @Body(ValidationPipe) dto: CreateResourceDto) {
        return await this.resourcesService.createResource(req.user.user_id, dto);
    }
    
    @Patch(":id")
    async updateResource(
        @Param("id") id: string, 
        @Req() req: any, 
        @Body() dto: UpdateResourceDto
    ) {    
        return await this.resourcesService.updateResource(id, req.user.user_id, dto);
    }

    @Delete(":id")
    async deleteResource(@Param("id") id: string, @Req() req: any) {
        return await this.resourcesService.deleteResource(id, req.user.user_id);
    }
}