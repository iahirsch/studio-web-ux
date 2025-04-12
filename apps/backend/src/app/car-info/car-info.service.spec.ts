import { Test, TestingModule } from '@nestjs/testing';
import { CarInfoService } from './car-info.service';

describe('CarInfoService', () => {
  let service: CarInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarInfoService],
    }).compile();

    service = module.get<CarInfoService>(CarInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
