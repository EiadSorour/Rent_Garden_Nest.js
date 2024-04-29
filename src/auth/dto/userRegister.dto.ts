import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UserRoles } from "../../user/enums/roles.enum";
import { ApiProperty } from '@nestjs/swagger';

export class UserRegisterDto{
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(UserRoles)
    @ApiProperty({
        enum: UserRoles
    })
    role: string;

    @IsNumber()
    @IsOptional()
    @ApiProperty({required: false})
    moneyOwned: number;
}