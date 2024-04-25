import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { AwsController } from './aws.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [],
  exports: [AwsService],
  controllers: [AwsController],
  providers: [AwsService],
})
export class AwsModule {}
