import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RentModule } from './rent/rent.module';
import { GardenModule } from './garden/garden.module';

@Module({
  imports: [UserModule , RentModule , GardenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
