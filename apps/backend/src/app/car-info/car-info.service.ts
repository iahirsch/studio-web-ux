import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarInfo } from './car-info.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CarInfoService {
  constructor(
    @InjectRepository(CarInfo)
    private carInfoRepository: Repository<CarInfo>
  ) {}

  async saveCarInfo() {
    //carInfo
  }
}
