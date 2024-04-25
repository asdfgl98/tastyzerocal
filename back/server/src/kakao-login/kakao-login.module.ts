import { Module } from '@nestjs/common';
import { KakaoLoginService } from './kakao-login.service';
import { KakaoLoginController } from './kakao-login.controller';

@Module({
  controllers: [KakaoLoginController],
  providers: [KakaoLoginService],
})
export class KakaoLoginModule {}
