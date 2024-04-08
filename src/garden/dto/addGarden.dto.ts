import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddGardenDto{
    
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;
    
    @IsNumber()
    @IsNotEmpty()
    size: number;
    
    @IsString()
    @IsNotEmpty()
    location: string;
    
    @IsNumber()
    @IsNotEmpty()
    hourPrice: number;
    
    @IsString()
    @IsOptional()
    image: string;

}