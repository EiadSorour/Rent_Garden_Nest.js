import { Module } from "@nestjs/common";
import { RentController } from "./rent.controller";
import { RentService } from "./rent.service";


@Module({
    imports: [],
    controllers: [RentController],
    providers: [RentService],
    exports: []
})
export class RentModule{}