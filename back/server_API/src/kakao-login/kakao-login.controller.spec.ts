import { Test, TestingModule } from '@nestjs/testing';
import { KakaoLoginController } from './kakao-login.controller';
import { KakaoLoginService } from './kakao-login.service';

describe('KakaoLoginController', () => {
  let controller: KakaoLoginController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KakaoLoginController],
      providers: [KakaoLoginService],
    }).compile();

    controller = module.get<KakaoLoginController>(KakaoLoginController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
