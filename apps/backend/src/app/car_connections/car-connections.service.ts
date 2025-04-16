import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarConnections } from './car-connections.entity';
import { User } from '../user/user.entity';
import { CarInfo } from '../car-info/car-info.entity';

@Injectable()
export class CarConnectionsService {
  constructor(
    @InjectRepository(CarConnections)
    private carConnectionsRepository: Repository<CarConnections>) {
  }

  async saveCarConnection(connectionData: {
    from: object;
    to: object;
    date: Date;
    departure: string;
    arrival: string;
    duration: string;
    user: User;
    passengers: User[];
    carInfo: CarInfo;
  }): Promise<CarConnections> {

    const carConnection = this.carConnectionsRepository.create(connectionData);
    await this.carConnectionsRepository.save(carConnection);

    return carConnection;
  }

  async addPassenger(connectionId: number, user: User): Promise<CarConnections> {
    const connection = await this.carConnectionsRepository.findOne({
      where: { id: connectionId },
      relations: ['passengers']
    });

    if (!connection) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }

    // Check if the user is already a passenger
    const isAlreadyPassenger = connection.passengers.some(
      passenger => passenger.id === user.id
    );

    if (!isAlreadyPassenger) {
      connection.passengers.push(user);
      await this.carConnectionsRepository.save(connection);
    }

    return connection;
  }

  async getUserCarConnections(userId: string): Promise<CarConnections[]> {
    return this.carConnectionsRepository.createQueryBuilder('connection')
      .leftJoinAndSelect('connection.passengers', 'passenger')
      .leftJoinAndSelect('connection.user', 'driver')
      .leftJoinAndSelect('connection.carInfo', 'carInfo')
      .leftJoinAndSelect('driver.carInfo', 'driverCarInfo')
      .where('passenger.id = :userId', { userId })
      .getMany();
  }

  async getCarConnectionWithPassengers(connectionId: number): Promise<CarConnections> {
    const connection = await this.carConnectionsRepository.findOne({
      where: { id: connectionId },
      relations: ['passengers', 'user', 'carInfo']
    });

    if (!connection) {
      throw new Error(`Connection with ID ${connectionId} not found`);
    }
    return connection;
  }
}
