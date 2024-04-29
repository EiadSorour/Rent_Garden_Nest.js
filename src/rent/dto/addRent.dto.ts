import { IsDate, IsDateString, IsEmpty, IsNotEmpty, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class AddRentDto{
    
    @IsEmpty()
    @ApiProperty({
        description: "UUID",
        readOnly: true
    })
    userID: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        description: "UUID"
    })
    gardenID: string;

    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        example: "2003-02-14 21:00:00.000",
        format: "yyyy-mm-dd hh:mm:ss.SSS"
    })
    fromDate: Date;
    
    @IsDateString()
    @IsNotEmpty()
    @ApiProperty({
        example: "2003-02-14 23:00:00.000",
        format: "yyyy-mm-dd hh:mm:ss.SSS"
    })
    toDate: Date;

    @IsEmpty()
    @ApiProperty({
        description: "total rent cost",
        readOnly: true
    })
    cost: number;

}