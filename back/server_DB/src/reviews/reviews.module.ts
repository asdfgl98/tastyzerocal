import { BadRequestException, Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{
    name: Review.name,
    schema: ReviewSchema
  }]) 
],
  exports:[ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
