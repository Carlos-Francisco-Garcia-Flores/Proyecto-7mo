import { Test, TestingModule } from '@nestjs/testing';
import { InformacionController } from './informacion.controller';

describe('InformacionController', () => {
  let controller: InformacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InformacionController],
    }).compile();

    controller = module.get<InformacionController>(InformacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
