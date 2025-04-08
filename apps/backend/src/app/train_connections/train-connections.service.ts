import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TrainConnections } from './train-connections.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TrainConnectionsService {
  constructor(
    @InjectRepository(TrainConnections)
    private trainConnectionsRepository: Repository<TrainConnections>) {
  }

  async saveJourney(journeyData: any, id: string) {

    const journey = this.trainConnectionsRepository.create({
      departure: journeyData.departure,
      arrival: journeyData.arrival,
      passengers: 1,
      user: id
    });

    await this.trainConnectionsRepository.save(journey);

    return journey;
  }
}
