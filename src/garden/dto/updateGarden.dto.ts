import { IsNumber, IsOptional, IsString } from "class-validator";

export class AddGardenDto{
    
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;
    
    @IsNumber()
    @IsOptional()
    size: number;
    
    @IsString()
    @IsOptional()
    location: string;
    
    @IsNumber()
    @IsOptional()
    hourPrice: number;
    
    @IsString()
    @IsOptional()
    image: string;

}