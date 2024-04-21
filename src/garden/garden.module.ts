import { Module } from "@nestjs/common";
import { GardenController } from "./garden.controller";
import { GardenService } from "./garden.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Garden } from "./garden.model";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [SequelizeModule.forFeature([Garden]), ConfigModule.forRoot()],
    controllers: [GardenController],
    providers: [GardenService],
    exports: [GardenService]
})
export class GardenModule{}