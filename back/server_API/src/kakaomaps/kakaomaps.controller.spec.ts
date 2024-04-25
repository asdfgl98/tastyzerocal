import { Test, TestingModule } from '@nestjs/testing';
import { KakaomapsController } from './kakaomaps.controller';
import { KakaomapsService } from './kakaomaps.service';

describe('KakaomapsController', () => {
  let controller: KakaomapsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KakaomapsController],
      providers: [KakaomapsService],
    }).compile();

    controller = module.get<KakaomapsController>(KakaomapsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
