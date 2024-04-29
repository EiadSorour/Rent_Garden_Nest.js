import { IsDateString, IsNumber, IsOptional, IsUUID } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRentDto{
    
    @IsUUID()
    @IsOptional()
    @ApiProperty({
        description: "UUID",
        required: false
    })
    userID: string;

    @IsUUID()
    @IsOptional()
    @ApiProperty({
        description: "UUID",
        required: false
    })
    gardenID: string;
    
    @IsDateString()
    @IsOptional()
    @ApiProperty({
        example: "2003-02-14 21:00:00.000",
        format: "yyyy-mm-dd hh:mm:ss.SSS",
        required: false
    })
    fromDate: Date;
    
    @IsDateString()
    @IsOptional()
    @ApiProperty({
        example: "2003-02-14 23:00:00.000",
        format: "yyyy-mm-dd hh:mm:ss.SSS",
        required: false
    })
    toDate: Date;
    
    @IsNumber()
    @IsOptional()
    @ApiProperty({
        description: "total rent cost",
        required: false
    })
    cost: number;

}