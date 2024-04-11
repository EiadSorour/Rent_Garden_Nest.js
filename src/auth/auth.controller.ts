import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserLoginDto } from "./dto/userLogin.dto";
import { AuthService } from "./auth.service";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { UserRegisterDto } from "./dto/userRegister.dto";

@Controller("/api")
export class AuthController{
    constructor(private readonly authService:AuthService){}

    @Post("/login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() userLoginDto:UserLoginDto){
        const token = await this.authService.login(userLoginDto);
        return {status: HttpStatusMessage.SUCCESS , data: {token}}
    }

    @Post("/register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() userRegisterDto:UserRegisterDto){
        const token = await this.authService.register(userRegisterDto);
        return {status: HttpStatusMessage.SUCCESS , data: {token}}
    }
}