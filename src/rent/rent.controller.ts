import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { RentService } from "./rent.service";
import { AdminGuard } from "src/guards/Admin.guard";
import { UpdateRentDto } from "./dto/updateRent.dto";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { Rent } from "./rent.model";
import { AuthGuard } from "src/guards/Auth.guard";
import { AddRentDto } from "./dto/addRent.dto";
import { ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

@ApiBearerAuth()
@Controller("/api/rent")
export class RentController{
    constructor(private readonly rentService:RentService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async makePayment(@Body() addRentDto:AddRentDto , @Req() request:any){
        addRentDto.userID = request.payload.id;
        const paymentUrl = await this.rentService.makePayment(addRentDto);
        return {status: HttpStatusMessage.SUCCESS, data: {paymentUrl: paymentUrl}}
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AdminGuard)
    @ApiQuery({name: "limit", required: true , type: Number})
    @ApiQuery({name: "offset" , required: true , type: Number})
    async getAllRents(@Query() query: any){
        const allRents:Rent[] = await this.rentService.getRents(query.limit , query.offset);
        return {status: HttpStatusMessage.SUCCESS, data: {rents: allRents}}
    }

    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AdminGuard)
    async deleteRent(@Param("id") rentID:string){
        await this.rentService.deleteRent(rentID);
        return {status: HttpStatusMessage.SUCCESS, data: {message: "Rent is deleted successfully"}}
    }

    @Patch("/:id")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AdminGuard)
    async updateRent(@Param("id") rentID:string , @Body() updateRentDto:UpdateRentDto){
        const updatedRent:Rent = await this.rentService.updateRent(rentID , updateRentDto);
        return {status: HttpStatusMessage.SUCCESS, data: {rent: updatedRent}}
    }
}