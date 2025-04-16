import { Module } from '@nestjs/common';
import { CarInfoService } from './car-info.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarInfo } from './car-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CarInfo])],
  providers: [CarInfoService],
  exports: [TypeOrmModule, CarInfoService],
})
export class CarInfoModule {}
