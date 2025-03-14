import { Test, TestingModule } from '@nestjs/testing';
import { OjpApiService } from './ojp-api.service';

describe('OjpApiService', () => {
  let service: OjpApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OjpApiService],
    }).compile();

    service = module.get<OjpApiService>(OjpApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
