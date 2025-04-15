import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CarInfo } from './car-info.entity';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class CarInfoService {
  constructor(
    @InjectRepository(CarInfo)
    private carInfoRepository: Repository<CarInfo>
  ) {}

  async saveCarInfo(carData: { availableSeats: number; seatComment: string; numberPlate: string; color: string; description: string; user: User }): Promise<CarInfo> {

    const carInfo = this.carInfoRepository.create(carData);
    await this.carInfoRepository.save(carInfo);

    return carInfo;
  }

  async findById(id: number): Promise<CarInfo> {
    return this.carInfoRepository.findOne({
      where: { id },
      relations: ['carConnections']
    });
  }
}
