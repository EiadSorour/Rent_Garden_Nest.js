import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Rent } from "./rent.model";
import { UpdateRentDto } from "./dto/updateRent.dto";
import { AddRentDto } from "./dto/addRent.dto";
import { GardenService } from "src/garden/garden.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class RentService{
    constructor(
        @InjectModel(Rent) private readonly rentModel: typeof Rent , 
        private readonly gardenService:GardenService,
        private readonly userService:UserService
    ){}

    async addRent(addRentDto: AddRentDto): Promise<Rent>{
        
        // calculate rent cost
        addRentDto.fromDate = new Date(addRentDto.fromDate)
        addRentDto.toDate = new Date(addRentDto.toDate)
        const rentedHours = Math.abs(addRentDto.fromDate.getTime() - addRentDto.toDate.getTime()) / (60*60*1000);
        const hourPrice = (await this.gardenService.getGarden(addRentDto.gardenID)).hourPrice;
        const cost = rentedHours*hourPrice;
        addRentDto.cost = cost;
        
        // take cost from the user
        const moneyOwned:number = (await this.userService.getUserById(addRentDto.userID)).moneyOwned;
        if(moneyOwned < cost){
            throw new HttpException("User doesn't have enough money to make this rent" , HttpStatus.BAD_REQUEST);
        }
        await this.userService.withdrawMoney(addRentDto.userID , cost);

        const rent = await this.rentModel.create(addRentDto as any);
        return rent;
    }

    async getRents(): Promise<Rent[]>{
        //Pagination here 
        return await this.rentModel.findAll();
    }

    async getRent(rentID:string): Promise<Rent>{
        const rent:Rent = await this.rentModel.findOne({where: {rentID:rentID}})
        return rent;
    }

    async deleteRent(rentID:string): Promise<number>{
        const rent:Rent = await this.getRent(rentID);
        if(!rent){
            throw new HttpException("This rent doesn't exist" , HttpStatus.NOT_FOUND);
        }
        // Money return to the user
        await this.userService.returnMoney(rent.userID as any , rent.cost);

        const deletedRents:number = await this.rentModel.destroy({where: {rentID:rentID}});
        return deletedRents;
    }

    async updateRent(rentID: string , updateRentDto:UpdateRentDto): Promise<Rent>{
        const rent:Rent = await this.getRent(rentID);
        if(!rent){
            throw new HttpException("This rent doesn't exist" , HttpStatus.NOT_FOUND);
        }
        const updatedRent:Rent = (await this.rentModel.update({...updateRentDto} , {where: {rentID:rentID} , returning: true}))[1][0];
        return updatedRent;
    }
}