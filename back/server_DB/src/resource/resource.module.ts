import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { region, regionSchema } from './schema/region.schema';

@Module({
  imports:[
    MongooseModule.forFeature([{name: region.name, schema: regionSchema}])
  ],
  controllers: [ResourceController],
  providers: [ResourceService],
})
export class ResourceModule {}
