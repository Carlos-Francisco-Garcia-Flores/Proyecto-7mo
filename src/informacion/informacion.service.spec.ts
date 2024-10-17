import { Test, TestingModule } from '@nestjs/testing';
import { InformacionService } from './informacion.service';

describe('InformacionService', () => {
  let service: InformacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InformacionService],
    }).compile();

    service = module.get<InformacionService>(InformacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
