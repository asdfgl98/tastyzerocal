import { Test, TestingModule } from '@nestjs/testing';
import { KakaomapsService } from './kakaomaps.service';

describe('KakaomapsService', () => {
  let service: KakaomapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KakaomapsService],
    }).compile();

    service = module.get<KakaomapsService>(KakaomapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
