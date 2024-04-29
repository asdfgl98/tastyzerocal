import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AccessTokenGuard, BearerTokenGuard } from 'src/guard/bearer-token.guard';
import { WriteCommentDTO } from './dto/write-comment.dto';
import { String } from 'aws-sdk/clients/batch';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**모든 리뷰 조회 */
  @Get()
  async getReviewData(){
    return await this.reviewsService.getAllReviewData()
  }

  @Delete()
  async deleteAllReview(){
    return await this.reviewsService.deleteAllReview()
  }

  @Get()
  async getReviewDataWithId(@Param() id: string){
    await this.reviewsService.getReviewDataWithId(id)
  }

  @Get('comment')
  async getComments(@Query('postId') postId: any){
    return await this.reviewsService.getComments(postId)
  }

  @Post('comment')
  @UseGuards(BearerTokenGuard)
  async writeComment(
    @Body() commentData: WriteCommentDTO,
    @Req() req: any
  ){
    const result = await this.reviewsService.writeComment(commentData, req.user)
    return result
  }

  @Delete('comment')
  @UseGuards(BearerTokenGuard)
  async deleteComment(
    @Query('commentId') commentId: string,
    @Query('postId') postId: string
  ){
    return await this.reviewsService.deleteComment(commentId,postId)
  }

  @Put('/view/:postId')
    viewCount(
    @Param('postId') postId: string
  ){ 
     this.reviewsService.viewCount(postId)
  }

  @Put('/like')
  @UseGuards(BearerTokenGuard)
  async likeCount(
    @Query('postId') postId: string,
    @Query('isMyPage') isMyPage: boolean,
    @Req() req:any
  ){
    return await this.reviewsService.likeCount(postId, req.user.id, isMyPage)
  }

  
}
