import { HttpStatus, Injectable } from "@nestjs/common";
import { AddGardenDto } from "./dto/addGarden.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Garden } from "./garden.model";
import { UpdateGardenDto } from "./dto/updateGarden.dto";
import { Op } from "sequelize";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { AppError } from "src/utils/app.Error";
import * as fs from "fs";
import { join } from "path";

@Injectable()
export class GardenService{
    constructor(@InjectModel(Garden) private readonly gardenModel: typeof Garden){}

    async getOtherGardens(userID:string): Promise<Garden[]>{
        // Pagination here
        const otherGardens:Garden[] = await this.gardenModel.findAll({where: {ownerID: { [Op.ne]: userID }} })
        return otherGardens;
    }

    async getUserGardens(ownerID:string): Promise<Garden[]>{
        // Pagination here
        const userGardens:Garden[] = await this.gardenModel.findAll({where: {ownerID:ownerID}});
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
        console.log(__dirname);
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
        fs.unlink(join(__dirname , ".." , "../uploads" , garden.image), (err)=>{
            console.log(err);
        })
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
            fs.unlink(join(__dirname , ".." , "../uploads" , garden.image), (err)=>{
                console.log(err);
            })
        }
        
        const updatedGarden:Garden = (await this.gardenModel.update({...updateGardenDto} , {where: {gardenID:gardenID} , returning: true}))[1][0];
        return updatedGarden;
    }

}