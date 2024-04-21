import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Rent } from "./rent.model";
import { UpdateRentDto } from "./dto/updateRent.dto";
import { AddRentDto } from "./dto/addRent.dto";
import { GardenService } from "src/garden/garden.service";
import { AppError } from "src/utils/app.Error";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

@Injectable()
export class RentService{
    constructor(
        @InjectModel(Rent) private readonly rentModel: typeof Rent , 
        private readonly gardenService:GardenService,
    ){}

    async makePayment(addRentDto: AddRentDto): Promise<string>{
        
        addRentDto.fromDate = new Date(addRentDto.fromDate)
        addRentDto.toDate = new Date(addRentDto.toDate)

        // check if garden is available
        const desiredGardenRents:Rent[] = await this.rentModel.findAll({where: {gardenID:addRentDto.gardenID}});
        const fromDate1 = addRentDto.fromDate;
        const toDate1 = addRentDto.toDate;
        desiredGardenRents.forEach(rent => {
            const fromDate2 = rent.fromDate;
            const toDate2 = rent.toDate;
            if(fromDate1 > fromDate2 && fromDate1 < toDate2 || fromDate2 > fromDate1 && fromDate2 < toDate1){
                throw new AppError("This garden is not available in this period" , HttpStatusMessage.FAIL , HttpStatus.BAD_REQUEST);
            }
        });
        
        // calculate rent cost in cents
        const rentedHours = Math.abs(addRentDto.fromDate.getTime() - addRentDto.toDate.getTime()) / (60*60*1000);
        const gardenToRent = await this.gardenService.getGarden(addRentDto.gardenID);
        const hourPrice = gardenToRent.hourPrice;
        const cost = rentedHours*hourPrice;
        addRentDto.cost = cost;
        
        // make payment
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data:{
                        currency: "egp",
                        product_data:{
                            name: gardenToRent.title
                        },
                        unit_amount: addRentDto.cost*100
                    },
                    quantity: 1
                }
            ],
            success_url: "http://localhost:3000/test/response",
            cancel_url: "http://localhost:3000/test/cancel",
        });

        return session.url;
    }

    async getRents(limit:number , offset:number): Promise<Rent[]>{
        return await this.rentModel.findAll({limit:limit , offset:offset});
    }

    async getRent(rentID:string): Promise<Rent>{
        const rent:Rent = await this.rentModel.findOne({where: {rentID:rentID}})
        return rent;
    }

    async deleteRent(rentID:string): Promise<number>{
        const rent:Rent = await this.getRent(rentID);
        if(!rent){
            throw new AppError("This rent doesn't exist" , HttpStatusMessage.FAIL , HttpStatus.NOT_FOUND);
        }
        // Money return to the user
        

        const deletedRents:number = await this.rentModel.destroy({where: {rentID:rentID}});
        return deletedRents;
    }

    async updateRent(rentID: string , updateRentDto:UpdateRentDto): Promise<Rent>{
        const rent:Rent = await this.getRent(rentID);
        if(!rent){
            throw new AppError("This rent doesn't exist" , HttpStatusMessage.FAIL , HttpStatus.NOT_FOUND);
        }
        const updatedRent:Rent = (await this.rentModel.update({...updateRentDto} , {where: {rentID:rentID} , returning: true}))[1][0];
        return updatedRent;
    }
}