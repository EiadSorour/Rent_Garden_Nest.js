import { Module } from "@nestjs/common";
import { RentController } from "./rent.controller";
import { RentService } from "./rent.service";
import { Rent } from "./rent.model";
import { SequelizeModule } from "@nestjs/sequelize";


@Module({
    imports: [SequelizeModule.forFeature([Rent])],
    controllers: [RentController],
    providers: [RentService],
    exports: []
})
export class RentModule{}