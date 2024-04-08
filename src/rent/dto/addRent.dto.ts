import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class AddGardenDto{
    
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