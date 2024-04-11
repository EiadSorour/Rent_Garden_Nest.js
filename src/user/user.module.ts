import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user.model";
import { GardenModule } from "src/garden/garden.module";


@Module({
    imports: [SequelizeModule.forFeature([User]) , GardenModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule{}