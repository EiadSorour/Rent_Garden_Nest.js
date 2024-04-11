import { Body, Controller, HttpCode, HttpStatus, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/Auth.guard";
import { GardenService } from "./garden.service";
import { AddGardenDto } from "./dto/addGarden.dto";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";

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

        const createdGarden = await this.gardenService.addGarden(addGradenDto);
        return {status: HttpStatusMessage.SUCCESS , data: {garden: createdGarden}}
    }


}