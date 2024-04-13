import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserLoginDto } from "./dto/userLogin.dto";
import { UserRegisterDto } from "./dto/userRegister.dto";
import * as bcrypt from 'bcrypt';
import { User } from "src/user/user.model";
import { AppError } from "src/utils/app.Error";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";

@Injectable()
export class AuthService{
    constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService
    ){}

    async login(userLoginDto:UserLoginDto): Promise<string>{
        const user:User = await this.userService.getUserByUsername(userLoginDto.username);

        if(!user){
            throw new AppError("user doesn't exist", HttpStatusMessage.FAIL , HttpStatus.NOT_FOUND);
        }

        const correctPassword:boolean = await bcrypt.compare(userLoginDto.password , user.password);
        if(!correctPassword){
            throw new AppError("Incorrect password" , HttpStatusMessage.FAIL , HttpStatus.UNAUTHORIZED);
        }

        const payload = {id: user.userID , username: user.username , role: user.role};
        return this.jwtService.sign(payload);
    }

    async register(userRegisterDto:UserRegisterDto): Promise<string>{
        const oldUser:User = await this.userService.getUserByUsername(userRegisterDto.username);
        if(oldUser){
            throw new AppError("User already exists" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
        }
        
        userRegisterDto.password = await bcrypt.hash(userRegisterDto.password , 10);
        await this.userService.addUser(userRegisterDto);
        
        const user = await this.userService.getUserByUsername(userRegisterDto.username);
        const payload = {id: user.userID , username: user.username , role: user.role};
        return this.jwtService.sign(payload);
    }
}