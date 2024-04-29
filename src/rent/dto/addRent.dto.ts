import { IsDate, IsDateString, IsEmpty, IsNotEmpty, IsUUID } from "class-validator";

export class AddRentDto{
    
    @IsEmpty()
    userID: string;

    @IsUUID()
    @IsNotEmpty()
    gardenID: string;

    @IsDateString()
    @IsNotEmpty()
    fromDate: Date;
    
    @IsDateString()
    @IsNotEmpty()
    toDate: Date;

    @IsEmpty()
    cost: number;

}