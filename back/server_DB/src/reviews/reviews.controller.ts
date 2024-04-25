import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { BearerTokenGuard } from 'src/guard/bearer-token.guard';
import { CreateReviewDTO } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**모든 리뷰 조회 */
  @Get()
  async getReviewData(){
    return await this.reviewsService.getReviewData()
  }

  @Delete()
  async deleteAllReview(){
    return await this.reviewsService.deleteAllReview()
  }

  @Get()
  async getReviewDataWithId(@Param() id: string){
    await this.reviewsService.getReviewDataWithId(id)
  }

  
}
