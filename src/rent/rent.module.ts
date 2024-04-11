import { Module } from "@nestjs/common";
import { RentController } from "./rent.controller";
import { RentService } from "./rent.service";
import { Rent } from "./rent.model";
import { SequelizeModule } from "@nestjs/sequelize";
import { GardenModule } from "src/garden/garden.module";
import { UserModule } from "src/user/user.module";


@Module({
    imports: [SequelizeModule.forFeature([Rent]) , GardenModule , UserModule],
    controllers: [RentController],
    providers: [RentService],
    exports: []
})
export class RentModule{}