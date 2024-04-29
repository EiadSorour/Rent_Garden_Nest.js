import { Module } from "@nestjs/common";
import { RentController } from "./rent.controller";
import { RentService } from "./rent.service";
import { Rent } from "./rent.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { GardenModule } from "src/garden/garden.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot(), SequelizeModule.forFeature([Rent]) , GardenModule],
    controllers: [RentController],
    providers: [RentService],
    exports: []
})
export class RentModule{}