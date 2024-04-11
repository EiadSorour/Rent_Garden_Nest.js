import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddRentDto{
    
    @IsString()
    @IsNotEmpty()
    gardenID: string;

    @IsDate()
    @IsNotEmpty()
    fromDate: Date;
    
    @IsDate()
    @IsNotEmpty()
    toDate: Date;

}