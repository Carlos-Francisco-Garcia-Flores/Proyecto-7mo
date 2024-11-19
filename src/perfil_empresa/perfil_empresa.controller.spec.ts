import { Test, TestingModule } from '@nestjs/testing';
import { PerfilEmpresaController } from './perfil_empresa.controller';

describe('PerfilEmpresaController', () => {
  let controller: PerfilEmpresaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfilEmpresaController],
    }).compile();

    controller = module.get<PerfilEmpresaController>(PerfilEmpresaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
