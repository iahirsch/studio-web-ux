import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarConnections } from './car-connections.entity';

@Injectable()
export class CarConnectionsService {
  constructor(
    @InjectRepository(CarConnections)
    private carConnectionsRepository: Repository<CarConnections>) {
  }
}
