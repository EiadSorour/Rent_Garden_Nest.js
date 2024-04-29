import { Body, Controller, Delete, FileTypeValidator, Get, HttpCode, HttpStatus, Param, ParseFilePipe, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/guards/Auth.guard";
import { GardenService } from "./garden.service";
import { AddGardenDto } from "./dto/addGarden.dto";
import { HttpStatusMessage } from "src/utils/httpStatusMessage.enum";
import { UpdateGardenDto } from "./dto/updateGarden.dto";
import { Garden } from "./garden.model";
import { diskStorage } from "multer";
import { v2 as cloudinary } from "cloudinary";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery } from "@nestjs/swagger";

const storage = diskStorage({
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + `.${file.mimetype.split("/")[1]}`)
    }
})

const fileValidation = new ParseFilePipe({
    validators: [
        new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" }),
    ],
    fileIsRequired: false,
})

@ApiBearerAuth()
@Controller("/api/garden")
@UseGuards(AuthGuard)
export class GardenController {
    constructor(private readonly gardenService: GardenService) {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiQuery({ name: "limit", required: true, type: Number })
    @ApiQuery({ name: "offset", required: true, type: Number })
    async getOtherGardens(@Query() query: any, @Req() request: any) {
        const userID: string = request.payload.id;
        const otherGardens: Garden[] = await this.gardenService.getOtherGardens(userID, query.limit, query.offset);
        return { status: HttpStatusMessage.SUCCESS, data: { gardens: otherGardens } }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('image', { storage: storage }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                ownerID: {
                    description: "UUID",
                    readOnly: true
                },
                title: { type: "string" },
                description: {type: "string"},
                size: {type: "number"},
                location: {type: "string"},
                hourPrice: {type: "number", description: "garden price per hour"},
                image: {
                    type: 'string',
                    format: 'binary',
                    description: "garden image",
                },
            },
        },
    })
    async addGarden(@UploadedFile(fileValidation) image: Express.Multer.File, @Body() addGradenDto: AddGardenDto, @Req() request: any) {

        addGradenDto.ownerID = request.payload.id;
        addGradenDto.size = Number(addGradenDto.size);
        addGradenDto.hourPrice = Number(addGradenDto.hourPrice);

        if (image) {
            const result = await cloudinary.uploader.upload(
                image.path,
                { public_id: `${addGradenDto.ownerID}_${addGradenDto.title}_garden` },
            );
            addGradenDto.image = result.secure_url;
        } else {
            addGradenDto.image = null;
        }

        const createdGarden: Garden = await this.gardenService.addGarden(addGradenDto);
        return { status: HttpStatusMessage.SUCCESS, data: { garden: createdGarden } }
    }

    @Delete("/:id")
    @HttpCode(HttpStatus.OK)
    async deleteGarden(@Param("id") gardenID: string, @Req() request: any) {
        const userID: string = request.payload.id;
        await this.gardenService.checkGardenOwnership(gardenID, userID);
        await this.gardenService.deleteGarden(gardenID);
        return { status: HttpStatusMessage.SUCCESS, data: { message: "Garden is deleted successfully" } }
    }

    @Patch("/:id")
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(FileInterceptor('image', { storage: storage }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: { type: "string" },
                description: {type: "string"},
                size: {type: "number"},
                location: {type: "string"},
                hourPrice: {type: "number", description: "garden price per hour"},
                image: {
                    type: 'string',
                    format: 'binary',
                    description: "garden image",
                },
            },
        },
    })
    async updateGarden(@UploadedFile(fileValidation) image: Express.Multer.File, @Body() updateGardenDto: UpdateGardenDto, @Param("id") gardenID: string, @Req() request: any) {
        const userID: string = request.payload.id;
        await this.gardenService.checkGardenOwnership(gardenID, userID);

        if (image) {
            const result = await cloudinary.uploader.upload(
                image.path,
                { public_id: `${userID}_${updateGardenDto.title}_garden` },
            );
            updateGardenDto.image = result.secure_url;
        }

        const updatedGarden: Garden = await this.gardenService.updateGarden(gardenID, updateGardenDto);
        return { status: HttpStatusMessage.SUCCESS, data: { updatedGarden } }
    }


}