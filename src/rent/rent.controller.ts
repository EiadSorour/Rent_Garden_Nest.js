import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { RentService } from "./rent.service";
import { AdminGuard } from "src/guards/Admin.guard";
import { UpdateRentDto } from "./dto/updateRent.dto";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { Rent } from "./rent.model";
import { AuthGuard } from "src/guards/Auth.guard";
import { AddRentDto } from "./dto/addRent.dto";

@Controller("/api/rent")
export class RentController{
    constructor(private readonly rentService:RentService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
    async addRent(@Body() addRentDto:AddRentDto , @Req() request:any){
        addRentDto.userID = request.payload.id;
        const createdRent:Rent = await this.rentService.addRent(addRentDto);
        return {status: HttpStatusMessage.SUCCESS, data: {rent: createdRent}}
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @UseGuards(AdminGuard)
    async getAllRents(){
        const allRents:Rent[] = await this.rentService.getRents();
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