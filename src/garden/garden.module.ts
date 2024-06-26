import { Module } from "@nestjs/common";
import { GardenController } from "./garden.controller";
import { GardenService } from "./garden.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Garden } from "./garden.model";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [ConfigModule.forRoot(), SequelizeModule.forFeature([Garden])],
    controllers: [GardenController],
    providers: [GardenService],
    exports: [GardenService]
})
export class GardenModule{}