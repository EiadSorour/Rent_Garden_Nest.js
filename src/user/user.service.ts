import { Body, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "./user.model";
import { UserRegisterDto } from "src/auth/dto/userRegister.dto";

@Injectable()
export class UserService{
    constructor(@InjectModel(User) private readonly userModel: typeof User){}

    async addUser(@Body() userRegisterDto:UserRegisterDto): Promise<void>{
        await this.userModel.create(userRegisterDto as any);
    }

    async getUser(username:string): Promise<User>{
        return await this.userModel.findOne({where: {username:username}}); 
    }
}