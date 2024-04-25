import { Module } from '@nestjs/common';
import { KakaomapsService } from './kakaomaps.service';
import { KakaomapsController } from './kakaomaps.controller';

@Module({
  controllers: [KakaomapsController],
  providers: [KakaomapsService],
})
export class KakaomapsModule {}
