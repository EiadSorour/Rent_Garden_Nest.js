import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { UserLoginDto } from "./dto/userLogin.dto";
import { UserRegisterDto } from "./dto/userRegister.dto";
import * as bcrypt from 'bcrypt';
import { User } from "src/user/user.model";

@Injectable()
export class AuthService{
    constructor(
        private readonly userService:UserService,
        private readonly jwtService:JwtService
    ){}

    async login(userLoginDto:UserLoginDto): Promise<string>{
        const user:User = await this.userService.getUserByUsername(userLoginDto.username);

        const correctPassword:boolean = await bcrypt.compare(userLoginDto.password , user.password);
        if(!correctPassword){
            throw new HttpException("Incorrect password",HttpStatus.UNAUTHORIZED);
        }

        const payload = {id: user.userID , username: user.username , role: user.role};
        return this.jwtService.sign(payload);
    }

    async register(userRegisterDto:UserRegisterDto): Promise<string>{
        const oldUser:User = await this.userService.getUserByUsername(userRegisterDto.username);
        if(oldUser){
            throw new HttpException("User already exists" , HttpStatus.BAD_REQUEST);
        }
        
        userRegisterDto.password = await bcrypt.hash(userRegisterDto.password , 10);
        await this.userService.addUser(userRegisterDto);
        
        const user = await this.userService.getUserByUsername(userRegisterDto.username);
        const payload = {id: user.userID , username: user.username , role: user.role};
        return this.jwtService.sign(payload);
    }
}