import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AccessTokenGuard, BearerTokenGuard } from 'src/guard/bearer-token.guard';
import { WriteCommentDTO } from './dto/write-comment.dto';
import { String } from 'aws-sdk/clients/batch';
import { UsersService } from 'src/users/users.service';
import { AwsService } from 'src/aws/aws.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewDTO } from './dto/create-review.dto';

@Controller('reviews')
@ApiTags('reviews controller')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService,
    private readonly awsService: AwsService
  ) {}

  /**모든 리뷰 조회 */
  @Get()
  @ApiOperation({summary:'모든 리뷰 데이터 조회', description: "리뷰 게시판에서 사용 할 모든 리뷰 데이터를 불러옵니다."})
  @ApiOkResponse({description:'reviews data'})
  async getReviewData(){
    return await this.reviewsService.getAllReviewData()
  }

   /**리뷰 생성 */
   @Post()
   @ApiOperation({summary: '리뷰 생성', description: '리뷰 생성과 동시에 서버에 업로드 된 이미지를 AWS S3에 업로드 합니다.'})
   @ApiCreatedResponse({description: 'true'})
   @ApiResponse({status:400, description: 'BadRequest'})
   @ApiResponse({status:401, description: 'Unauthorized'})
   @ApiBearerAuth()
   @UseGuards(BearerTokenGuard)
   async createReview(
     @Body() createReviewDto: CreateReviewDTO,
     @Req() req: any,
   ){
     const {user} = req
     const s3ImageUrl = await this.awsService.imageUploadToS3(createReviewDto.image)
     const reviewResult = await this.reviewsService.createReview(createReviewDto, s3ImageUrl, user._id)
     const result = await this.usersService.reviewListUpdate(false ,user.id, reviewResult._id)
     return result
   }  



  @Delete()
  @ApiOperation({summary: '리뷰 삭제', description: '리뷰 삭제와 동시에 AWS S3에 업로드 된 이미지를 삭제합니다.'})
  @ApiOkResponse({description: 'true'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  async deleteReview(
    @Query('postId') postId: string,
    @Req() req: any
  ){
    const imageUrl = await this.reviewsService.deleteReview(postId, req.user.id)
    this.awsService.imageDeleteToS3(imageUrl)
    await this.usersService.reviewListUpdate(true, req.user.id, postId)
    return true
  }

  @Get('comment')
  @ApiOperation({summary: '리뷰 코멘트 불러오기', description: '리뷰에 대한 코멘트를 불러옵니다.'})
  @ApiOkResponse({description: 'comment list'})
  @ApiResponse({status:400, description: 'BadRequest'})
  async getComments(@Query('postId') postId: any){
    return await this.reviewsService.getComments(postId)
  }

  @Post('comment')
  @ApiOperation({summary: '리뷰 코멘트 생성', description: '리뷰에 대한 코멘트를 생성합니다.'})
  @ApiCreatedResponse({description: 'updated comment list'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  async writeComment(
    @Body() commentData: WriteCommentDTO,
    @Req() req: any
  ){
    const result = await this.reviewsService.writeComment(commentData, req.user)
    return result
  }

  @Delete('comment')
  @ApiOperation({summary: '리뷰 코멘트 삭제', description: '리뷰에 대한 코멘트를 삭제합니다.'})
  @ApiOkResponse({description: 'updated comment list'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  async deleteComment(
    @Query('commentId') commentId: string,
    @Query('postId') postId: string
  ){
    return await this.reviewsService.deleteComment(commentId,postId)
  }

  @Put('/view/:postId')
  @ApiOperation({summary: '조회수 증가', description: '리뷰에 대한 조회수를 수정합니다.'})
  @ApiOkResponse({description: 'updated view count'})
  @ApiResponse({status:400, description: 'BadRequest'})
    viewCount(
    @Param('postId') postId: string
  ){ 
     this.reviewsService.viewCount(postId)
  }

  @Put('/like')
  @ApiOperation({summary: '좋아요 수정', description: '리뷰에 대한 좋아요를 수정합니다.'})
  @ApiOkResponse({description: 'updated like count'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  async likeCount(
    @Query('postId') postId: string,
    @Query('isMyPage') isMyPage: boolean,
    @Req() req:any
  ){
    return await this.reviewsService.likeCount(postId, req.user.id, isMyPage)
  }

  
}
