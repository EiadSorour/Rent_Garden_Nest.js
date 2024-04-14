import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RentModule } from './rent/rent.module';
import { GardenModule } from './garden/garden.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname , ".." , "./uploads")
    }),
    ConfigModule.forRoot({isGlobal: true}),
    SequelizeModule.forRoot({
      dialect: process.env.DIALECT_USERNAME as any,
      host: process.env.HOST,
      port: process.env.PORT as any,
      username: process.env.DIALECT_USERNAME as any,
      password: process.env.PASSWORD as any,
      database: process.env.DATABASE as any,
      autoLoadModels: true,
      synchronize: true,
    }),
    UserModule , RentModule , GardenModule , AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
