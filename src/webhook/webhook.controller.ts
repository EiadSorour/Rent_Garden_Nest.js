import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { WebHookService } from './webhook.service';
import { RentService } from 'src/rent/rent.service';
import { HttpStatusMessage } from 'src/utils/httpStatusMessage.enum';

@Controller()
export class WebHookController {
    constructor(
        private readonly webHookService: WebHookService,
        private readonly rentService:RentService
    ) {}

    @Post("/webhook")
    async pay(@Body() event:any){
        if(event.type === "checkout.session.completed"){
            const metadata = event.data.object.metadata
            // Correct date format
            metadata.fromDate = (new Date(metadata.fromDate * 1000)).toISOString()
            metadata.toDate = (new Date(metadata.toDate * 1000)).toISOString()
            const createdRent = await this.rentService.addRent(metadata);
            return {status: HttpStatusMessage.SUCCESS , data: {rent : createdRent}}
        }
    }

    @Get("/response")
    async response(@Req() req:any){
        return "payment completed successfully";               
    }

    @Get("/cancel")
    async cancel(){
        return "payment canceled";
    }
}
