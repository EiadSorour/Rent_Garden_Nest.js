import { Module } from "@nestjs/common";
import { GardenController } from "./garden.controller";
import { GardenService } from "./garden.service";


@Module({
    imports: [],
    controllers: [GardenController],
    providers: [GardenService],
    exports: []
})
export class GardenModule{}