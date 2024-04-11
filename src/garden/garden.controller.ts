import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/Auth.guard";
import { GardenService } from "./garden.service";
import { AddGardenDto } from "./dto/addGarden.dto";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { UpdateGardenDto } from "./dto/updateGarden.dto";
import { Garden } from "./garden.model";

@Controller("/api/garden")
export class GardenController{
    constructor(private readonly gardenService: GardenService){}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
    async deleteGarden(@Param("id") gardenID:string , @Req() request:any){
        const userID:string = request.payload.id;
        await this.gardenService.checkGardenOwnership(gardenID , userID);
        await this.gardenService.deleteGarden(gardenID);
        return {status: HttpStatusMessage.SUCCESS , data: {message: "Garden is deleted successfully"}}
    }

    @Patch("/:id")
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard)
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