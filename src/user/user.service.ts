import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { UserRegisterDto } from "src/auth/dto/userRegister.dto";
import { Garden } from "src/garden/garden.model";
import { GardenService } from "src/garden/garden.service";

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User) private readonly userModel: typeof User, 
        private readonly gardenService: GardenService
    ){}

    async addUser(userRegisterDto: UserRegisterDto): Promise<void> {
        await this.userModel.create(userRegisterDto as any);
    }

    async withdrawMoney(userID:string , amount: number): Promise<void>{
        const newBalance: number = ((await this.getUserById(userID)).moneyOwned) - amount;
        await this.userModel.update({moneyOwned:newBalance} , {where: {userID:userID}} );
    }

    async returnMoney(userID:string , amount: number): Promise<void>{
        const newBalance: number = ((await this.getUserById(userID)).moneyOwned) + amount;
        await this.userModel.update({moneyOwned:newBalance} , {where: {userID:userID}} );
    }

    async getUserByUsername(username: string): Promise<User> {
        const user:User =  await this.userModel.findOne({ where: { username: username } });
        if(!user){
            throw new HttpException("user doesn't exist" , HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async getUserById(userID: string): Promise<User> {
        const user:User =  await this.userModel.findOne({ where: { userID: userID } });
        if(!user){
            throw new HttpException("user doesn't exist" , HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async getUserGardens(userID: string): Promise<Garden[]> {
        // Pagination here
        return this.gardenService.getUserGardens(userID);
    }
}