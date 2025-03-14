import { Test, TestingModule } from '@nestjs/testing';
import { OjpApiController } from './ojp-api.controller';

describe('OjpApiController', () => {
  let controller: OjpApiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OjpApiController],
    }).compile();

    controller = module.get<OjpApiController>(OjpApiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
