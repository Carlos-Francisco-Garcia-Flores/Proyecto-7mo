import { Test, TestingModule } from '@nestjs/testing';
import { PerfilEmpresaService } from './perfil_empresa.service';

describe('PerfilEmpresaService', () => {
  let service: PerfilEmpresaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfilEmpresaService],
    }).compile();

    service = module.get<PerfilEmpresaService>(PerfilEmpresaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
