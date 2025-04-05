import { Test, TestingModule } from '@nestjs/testing';
import { CarConnectionsService } from './car-connections.service';

describe('CarConnectionsService', () => {
  let service: CarConnectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarConnectionsService]
    }).compile();

    service = module.get<CarConnectionsService>(CarConnectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
