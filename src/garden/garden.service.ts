import { HttpStatus, Injectable } from "@nestjs/common";
import { AddGardenDto } from "./dto/addGarden.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Garden } from "./garden.model";
import { UpdateGardenDto } from "./dto/updateGarden.dto";
import { Op } from "sequelize";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { AppError } from "src/utils/app.Error";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

@Injectable()
export class GardenService{
    constructor(@InjectModel(Garden) private readonly gardenModel: typeof Garden){}

    async getOtherGardens(userID:string, limit:number , offset:number): Promise<Garden[]>{
        const otherGardens:Garden[] = await this.gardenModel.findAll({where: {ownerID: { [Op.ne]: userID }}, limit:limit , offset:offset })
        return otherGardens;
    }

    async getUserGardens(ownerID:string, limit: number , offset:number): Promise<Garden[]>{
        const userGardens:Garden[] = await this.gardenModel.findAll({where: {ownerID:ownerID}, limit:limit , offset:offset});
        return userGardens;
    }

    async getGarden(gardenID:string): Promise<Garden>{
        const garden:Garden = await this.gardenModel.findOne({where: {gardenID:gardenID}});
        if(!garden){
            throw new AppError("Garden doesn't exist" , HttpStatusMessage.FAIL , HttpStatus.NOT_FOUND);
        }
        
        return garden;
    }

    async addGarden(addGardenDto: AddGardenDto): Promise<Garden>{
        const createdGarden:Garden = await this.gardenModel.create(addGardenDto as any);
        return createdGarden.dataValues;
    }

    async checkGardenOwnership(gardenID: string , userID: string): Promise<void>{
        const garden:Garden = await this.gardenModel.findOne({where: {gardenID: gardenID}});
        if(!garden){
            throw new AppError("Garden doesn't exist" , HttpStatusMessage.FAIL , HttpStatus.NOT_FOUND);
        }
        
        if(garden.ownerID !== userID){
            throw new AppError("This user doesn't own this garden" , HttpStatusMessage.FAIL , HttpStatus.UNAUTHORIZED);
        }
    }

    async deleteGarden(gardenID:string): Promise<number>{
        const garden:Garden = await this.getGarden(gardenID);
        const deletedGardens:number = await this.gardenModel.destroy({where: {gardenID:gardenID}});
        await cloudinary.uploader.destroy(`${garden.ownerID}_${garden.title}_garden`);
        return deletedGardens;
    }

    async updateGarden(gardenID: string , updateGardenDto:UpdateGardenDto): Promise<Garden>{
        const garden:Garden = await this.getGarden(gardenID);
        if(updateGardenDto.size){
            updateGardenDto.size = Number(updateGardenDto.size);
        }
        
        if(updateGardenDto.hourPrice){
            updateGardenDto.hourPrice = Number(updateGardenDto.hourPrice);
        }

        if(updateGardenDto.image){
            await cloudinary.uploader.destroy(`${garden.ownerID}_${garden.title}_garden`);
        }
        
        const updatedGarden:Garden = (await this.gardenModel.update({...updateGardenDto} , {where: {gardenID:gardenID} , returning: true}))[1][0];
        return updatedGarden;
    }

}