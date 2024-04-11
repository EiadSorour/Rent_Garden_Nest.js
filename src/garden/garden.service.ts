import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AddGardenDto } from "./dto/addGarden.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Garden } from "./garden.model";
import { UpdateGardenDto } from "./dto/updateGarden.dto";

@Injectable()
export class GardenService{
    constructor(@InjectModel(Garden) private readonly gardenModel: typeof Garden){}

    async addGarden(addGardenDto: AddGardenDto): Promise<Garden>{
        const createdGarden:Garden = await this.gardenModel.create(addGardenDto as any);
        return createdGarden.dataValues;
    }

    async checkGardenOwnership(gardenID: string , userID: string): Promise<void>{
        const garden:Garden = await this.gardenModel.findOne({where: {gardenID: gardenID}});
        if(!garden){
            throw new HttpException("Garden doesn't exist" , HttpStatus.NOT_FOUND);
        }
        
        if(garden.ownerID !== userID){
            throw new HttpException("This user doesn't own this garden" , HttpStatus.UNAUTHORIZED);
        }
    }

    async getUserGardens(ownerID:string): Promise<Garden[]>{
        const userGardens:Garden[] = await this.gardenModel.findAll({where: {ownerID:ownerID}});
        return userGardens;
    }

    async deleteGarden(gardenID:string): Promise<number>{
        const deletedGardens:number = await this.gardenModel.destroy({where: {gardenID:gardenID}});
        // if(deletedGardens === 0){
        //     throw new HttpException("This garden doesn't exist" , HttpStatus.NOT_FOUND);
        // }

        return deletedGardens;
    }

    async updateGarden(gardenID: string , updateGardenDto:UpdateGardenDto): Promise<Garden>{
        if(updateGardenDto.size){
            updateGardenDto.size = Number(updateGardenDto.size);
        }
        
        if(updateGardenDto.hourPrice){
            updateGardenDto.hourPrice = Number(updateGardenDto.hourPrice);
        }
        
        const updatedGarden:Garden = (await this.gardenModel.update({...updateGardenDto} , {where: {gardenID:gardenID} , returning: true}))[1][0];
        return updatedGarden;
    }

}