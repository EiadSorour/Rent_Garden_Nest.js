import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateRentDto{
    
    @IsString()
    @IsOptional()
    userID: string;

    @IsString()
    @IsOptional()
    gardenID: string;
    
    @IsDate()
    @IsOptional()
    fromDate: Date;
    
    @IsDate()
    @IsOptional()
    toDate: Date;
    
    @IsNumber()
    @IsOptional()
    cost: number;

}