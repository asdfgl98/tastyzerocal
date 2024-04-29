import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseFilters, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FavoriteDTO } from './dto/favorite-dto';
import { BearerTokenGuard } from 'src/guard/bearer-token.guard';
import { HttpExceptionFilter } from 'src/exception-filter/http.exception-filter';
import { tokenDeleteToCookies } from 'src/Utils/JWT-Utils';
import { Response } from 'express';
import { CreateReviewDTO } from 'src/reviews/dto/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly ReviewService: ReviewsService,
    private readonly AwsService: AwsService
  ) {}

  /** 아이디 중복 검사 */
  @Get(':id')
  async idDuplicateCheck(@Param('id') id: string){
    const checkId = await this.usersService.userCheck(id)
    if(checkId){
      return false
    }
    return true
  }

  /** 회원정보 업데이트 */
  @Patch(':id')
  @UseGuards(BearerTokenGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    
    return this.usersService.update(id, updateUserDto);
  }

  /** 회원 탈퇴 */
  @Delete(':id')
  @UseGuards(BearerTokenGuard)
  async remove(
    @Param('id') id: string,
    @Req() req: any,
    @Res() res: Response
  ) {
    const {user} = req
    const result = await this.usersService.remove(id, user);
    tokenDeleteToCookies(res, "refresh_token")
    res.json({
      status: true,
      massege: "Refresh Token 쿠키 만료"
    })
  }

  /** 즐겨찾기 추가 */
  @Post('favorite')
  @UseGuards(BearerTokenGuard)
  @UseFilters(HttpExceptionFilter)
  async addFavorite(
    @Body() data: FavoriteDTO,
    @Req() req: any
  ){
    const result = await this.usersService.addFavorite(data, req.user)
    return result
  }

  /** 즐겨찾기 제거 */
  @Delete('favorite/:id')
  @UseGuards(BearerTokenGuard)
  @UseFilters(HttpExceptionFilter)
  async deleteFavorite(
    @Param('id') id: string,
    @Req() req:any
  ){
    return await this.usersService.deleteFavorite(id, req.user.id)    
  }

  /**리뷰 생성 */
  @Post('/review')
  @UseGuards(BearerTokenGuard)
  async createReview(
    @Body() createReviewDto: CreateReviewDTO,
    @Req() req: any,
  ){
    const {user} = req
    const s3ImageUrl = await this.AwsService.imageUploadToS3(createReviewDto.image)
    const reviewResult = await this.ReviewService.createReview(createReviewDto, s3ImageUrl, user._id)
    const result = await this.usersService.ReviewListUpdate(false ,user.id, reviewResult._id)
    return result
  }  

  @Get('/mydata/:id')
  @UseGuards(BearerTokenGuard)
  async getUserDataList(@Param('id') id:string){
    return await this.usersService.getUserDataList(id)
  }
}
