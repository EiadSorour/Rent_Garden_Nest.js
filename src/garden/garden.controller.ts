import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/Auth.guard";
import { GardenService } from "./garden.service";
import { AddGardenDto } from "./dto/addGarden.dto";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { UpdateGardenDto } from "./dto/updateGarden.dto";
import { Garden } from "./garden.model";

@Controller("/api/garden")
@UseGuards(AuthGuard)
export class GardenController{
    constructor(private readonly gardenService: GardenService){}

    @Get()
    @HttpCode(HttpStatus.OK)
    async getOtherGardens(@Req() request:any){
        const userID:string = request.payload.id;
        const otherGardens:Garden[] = await this.gardenService.getOtherGardens(userID);
        return {status: HttpStatusMessage.SUCCESS , data: {gardens: otherGardens}}
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image'))
    async addGarden(@UploadedFile() image:Express.Multer.File ,  @Body() addGradenDto:AddGardenDto , @Req() request:any){
        
        addGradenDto.ownerID = request.payload.id;
        addGradenDto.size = Number(addGradenDto.size);
        addGradenDto.hourPrice = Number(addGradenDto.hourPrice);
        if(image){
            addGradenDto.image = image.filename;
        }else{
            addGradenDto.image = null;
        }

        const createdGarden:Garden = await this.gardenService.addGarden(addGradenDto);
        return {status: HttpStatusMessage.SUCCESS , data: {garden: createdGarden}}
    }

    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    async deleteGarden(@Param("id") gardenID:string , @Req() request:any){
        const userID:string = request.payload.id;
        await this.gardenService.checkGardenOwnership(gardenID , userID);
        await this.gardenService.deleteGarden(gardenID);
        return {status: HttpStatusMessage.SUCCESS , data: {message: "Garden is deleted successfully"}}
    }

    @Patch("/:id")
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('image'))
    async updateGarden(@UploadedFile() image:Express.Multer.File , @Body() updateGardenDto:UpdateGardenDto ,@Param("id") gardenID:string , @Req() request:any){
        const userID:string = request.payload.id;
        await this.gardenService.checkGardenOwnership(gardenID , userID);

        if(image){
            updateGardenDto.image = image.filename;
        }else{
            updateGardenDto.image = null;
        }

        const updatedGarden:Garden = await this.gardenService.updateGarden(gardenID,updateGardenDto);
        return {status: HttpStatusMessage.SUCCESS , data: {updatedGarden}}
    }


}