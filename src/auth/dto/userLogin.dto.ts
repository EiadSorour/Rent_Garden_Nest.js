import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserLoginDto{
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}