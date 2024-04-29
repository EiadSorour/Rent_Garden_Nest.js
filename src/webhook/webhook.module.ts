import { Module } from "@nestjs/common";
import { WebHookService } from "./webhook.service";
import { WebHookController } from "./webhook.controller";
import { ConfigModule } from "@nestjs/config";
import { RentModule } from "src/rent/rent.module";

@Module({
    imports: [ConfigModule.forRoot(), RentModule],
    controllers: [WebHookController],
    providers: [WebHookService],
    exports: []
})
export class WebHookModule{}