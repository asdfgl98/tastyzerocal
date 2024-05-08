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
import { AwsService } from 'src/aws/aws.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users controller')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  /** 아이디 중복 검사 */
  @Get(':id')
  @ApiOperation({summary: '아이디 중복검사', description: '일반 회원가입 시 아이디 중복검사를 합니다.'})
  @ApiOkResponse({description: 'true | false'})
  async idDuplicateCheck(@Param('id') id: string){
    const checkId = await this.usersService.userCheck(id)
    if(checkId){
      return false
    }
    return true
  }

  /** 회원정보 업데이트 */
  @Patch(':id')
  @ApiOperation({summary: '회원정보 업데이트', description: '회원 정보를 업데이트합니다.'})
  @ApiOkResponse({description: 'true'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    
    return this.usersService.update(id, updateUserDto);
  }

  /** 회원 탈퇴 */
  @Delete(':id')
  @ApiOperation({summary: '회원 탈퇴', description: '회원 정보를 삭제합니다.'})
  @ApiOkResponse({description: 'true'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
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
  @ApiOperation({summary: '즐겨찾기 추가', description: '회원 정보에서 즐겨찾기를 추가합니다.'})
  @ApiOkResponse({description: 'updated userData response'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
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
  @ApiOperation({summary: '즐겨찾기 제거', description: '회원 정보에서 즐겨찾기를 삭제합니다.'})
  @ApiOkResponse({description: 'updated userData response'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  @UseFilters(HttpExceptionFilter)
  async deleteFavorite(
    @Param('id') id: string,
    @Req() req:any
  ){
    return await this.usersService.deleteFavorite(id, req.user.id)    
  }
 

  @Get('/mydata/:id')
  @ApiOperation({summary: 'MyPage 데이터 불러오기', description: 'MyPage에 필요한 유저 데이터를 불러옵니다.'})
  @ApiOkResponse({description: 'userData'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  async getUserDataList(@Param('id') id:string){
    return await this.usersService.getMyPageData(id)
  }
}
