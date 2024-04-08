import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UserRoles } from "../../user/enums/roles.enum";

export class UserRegisterDto{
    
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(UserRoles)
    role: string;

    @IsNumber()
    @IsOptional()
    moneyOwned: number;
}