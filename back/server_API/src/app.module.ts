import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KakaomapsModule } from './kakaomaps/kakaomaps.module';
import { KakaoLoginModule } from './kakao-login/kakao-login.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:`./config/.env.${process.env.NODE_ENV}`
    }),
    KakaomapsModule,
    KakaoLoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
