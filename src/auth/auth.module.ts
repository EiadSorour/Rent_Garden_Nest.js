import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        UserModule,
        ConfigModule.forRoot(),
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: {expiresIn: process.env.TOKEN_EXPIRE_TIME}
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: []
})
export class AuthModule{}