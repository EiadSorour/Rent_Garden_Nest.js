import { IsEmpty, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUUID } from "class-validator";

export class AddGardenDto{
    
    @IsEmpty()
    ownerID: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsNumberString()
    @IsNotEmpty()
    size: number;
    
    @IsString()
    @IsNotEmpty()
    location: string;
    
    @IsNumberString()
    @IsNotEmpty()
    hourPrice: number;
    
    @IsString()
    @IsOptional()
    image: string;

}