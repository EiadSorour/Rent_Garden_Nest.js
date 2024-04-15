import { IsDateString, IsNumber, IsOptional, IsUUID } from "class-validator";

export class UpdateRentDto{
    
    @IsUUID()
    @IsOptional()
    userID: string;

    @IsUUID()
    @IsOptional()
    gardenID: string;
    
    @IsDateString()
    @IsOptional()
    fromDate: Date;
    
    @IsDateString()
    @IsOptional()
    toDate: Date;
    
    @IsNumber()
    @IsOptional()
    cost: number;

}