import { BadRequestException, Module, forwardRef } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Comment, CommentSchema } from './schema/comment.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{
    name: Review.name,
    schema: ReviewSchema
  },
  {
    name: Comment.name,
    schema: CommentSchema
  }
]),
  forwardRef(()=>AuthModule),
  forwardRef(()=>UsersModule)
   
],
  exports:[ReviewsService],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
