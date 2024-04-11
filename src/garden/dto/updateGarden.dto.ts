import { IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateGardenDto{
    
    @IsString()
    @IsOptional()
    title: string;

    @IsString()
    @IsOptional()
    description: string;
    
    @IsNumberString()
    @IsOptional()
    size: number;
    
    @IsString()
    @IsOptional()
    location: string;
    
    @IsNumberString()
    @IsOptional()
    hourPrice: number;
    
    @IsString()
    @IsOptional()
    image: string;

}