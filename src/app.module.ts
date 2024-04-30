import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RentModule } from './rent/rent.module';
import { GardenModule } from './garden/garden.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { WebHookModule } from './webhook/webhook.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: process.env.DIALECT as any,
      host: process.env.HOST,
      port: process.env.DB_PORT as any,
      username: process.env.USERNAME as any,
      password: process.env.PASSWORD as any,
      database: process.env.DATABASE as any,
      autoLoadModels: true,
      synchronize: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: Number(process.env.TIME_TO_LIVE),
      limit: Number(process.env.LIMIT),
    }]), 
    UserModule, RentModule, GardenModule, AuthModule, WebHookModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
}) 
export class AppModule { }
