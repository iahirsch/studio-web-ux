import { Test, TestingModule } from '@nestjs/testing';
import { TrainConnectionsService } from './train-connections.service';

describe('TrainConnectionsService', () => {
  let service: TrainConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainConnectionsService]
    }).compile();

    service = module.get<TrainConnectionsService>(TrainConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
