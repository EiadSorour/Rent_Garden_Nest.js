import { Injectable } from "@nestjs/common";
import { AddGardenDto } from "./dto/addGarden.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Garden } from "./garden.model";

@Injectable()
export class GardenService{
    constructor(@InjectModel(Garden) private readonly gardenModel: typeof Garden){}

    async addGarden(addGardenDto: AddGardenDto): Promise<Garden>{
        const createdGarden:Garden = await this.gardenModel.create(addGardenDto as any);
        return createdGarden.dataValues;
    }

    

}