import { Controller, Get, HttpCode, HttpStatus, Query, Req, UseGuards } from "@nestjs/common";
import { Garden } from "src/garden/garden.model";
import { UserService } from "./user.service";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { AuthGuard } from "src/guards/Auth.guard";
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller("/api/user")
export class UserController{
    constructor(private readonly userService:UserService){}

    @Get("/gardens")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @ApiQuery({name: "limit", required: true , type: Number})
    @ApiQuery({name: "offset" , required: true , type: Number})
    async getUserGardens(@Query() query: any ,  @Req() request:any){
        const userID:string = request.payload.id;
        const userGardens: Garden[] = await this.userService.getUserGardens(userID, query.limit , query.offset);
        return {status: HttpStatusMessage.SUCCESS , data: {gardens: userGardens}}
    }
}