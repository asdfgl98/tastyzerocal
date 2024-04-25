import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { BearerTokenGuard } from 'src/guard/bearer-token.guard';
import { CreateReviewDTO } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**모든 리뷰 조회 */
  @Get()
  async getRiviewData(){
    return await this.reviewsService.getReviewData()
  }

  
}
