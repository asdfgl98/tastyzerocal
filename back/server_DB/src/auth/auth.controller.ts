import { Body, Controller, Delete, Get, Headers, Post, Req, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {  Response } from 'express';
import { BasicTokenGuard } from 'src/guard/basic-token.guard';
import { User } from 'src/decorator/auth.decorator';
import { BearerTokenGuard} from 'src/guard/bearer-token.guard';
import { CookieTokenGuard } from 'src/guard/Cookie-token.guard';
import { HttpExceptionFilter } from 'src/exception-filter/http.exception-filter';
import { tokenCreateForCookies, tokenDeleteToCookies } from 'src/Utils/JWT-Utils';
import { ApiBasicAuth, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('auth')
@ApiTags('auth contoller')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  /** 일반 회원가입 엔드포인트 */
  @Post('join')
  @ApiOperation({summary: '일반 회원가입', description: '일반 회원가입을 진행합니다.'})
  @ApiCreatedResponse({description: 'accessToken | refreshToken'})
  @ApiResponse({status:400, description: 'BadRequest'})
  async joinWithId
  (@Body() createUserDto: CreateUserDTO,
  @Res() res: Response
  ){
    const result = await this.authService.Join(createUserDto)
    tokenCreateForCookies(res, 'refresh_token', result)    
  }

  /** 소셜 회원가입 및 로그인 엔드포인트*/
  @Post('social-join')
  @ApiOperation({summary: '소셜 회원가입 및 로그인', description: '소셜 회원가입 또는 로그인을 진행합니다.'})
  @ApiCreatedResponse({description: 'accessToken & refreshToken'})
  @ApiResponse({status:400, description: 'BadRequest'})
  async joinWithSocial(@Body() createSocialDTO: CreateUserDTO){
    return await this.authService.Join(createSocialDTO)
  }

  /** access 토큰 재발급 엔드포인트 */
  @Post('token/access')
  @ApiOperation({summary: '엑세스 토큰 재발급', description: '리프레시 토큰으로 엑세스 토큰을 재발급 받습니다.'})
  @ApiCreatedResponse({description: 'new accessToken'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(CookieTokenGuard)
  @UseFilters(HttpExceptionFilter)
   async tokenAccess(@Request() req:any){
    const {token} = req
    
    const newToken = this.authService.rotateToken(token, false)
    return {
      accessToken: newToken
    }
  }

  /** 토큰으로 회원정보 요청 엔드포인트 */
  @Get('/userInfo')
  @ApiOperation({summary: '회원정보 조회', description: '엑세스 토큰으로 회원정보를 조회합니다.'})
  @ApiOkResponse({description: 'user data'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  async userInfo(
    @Request() req: any
  ){
    return req.user
  }

  // // refresh 토큰 재발급 엔드포인트
  // @Post('token/refresh')
  //  async tokenRefresh(@Headers('authorization') rawToken: string){
  //   const token = await this.authService.extractTokenFromHeader(rawToken, true)

  //   const newToken = this.authService.rotateToken(token, true)

  //   return {
  //     refresh: newToken
  //   }
  // }


  /** 일반 로그인 엔드포인트 */
  @Post('login')
  @ApiOperation({summary: '일반 로그인', description: '일반 로그인을 진행합니다.'})
  @ApiCreatedResponse({description: 'accessToken & refreshToken'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBasicAuth()
  @UseGuards(BasicTokenGuard)
   async loginId(
    @User() user: {id: string, password: string},
    @Res() res: Response
  ){
    const result = await this.authService.loginWithId(user)
    tokenCreateForCookies(res, 'refresh_token', result)  
  }

  /** 로그아웃 엔드포인트*/
  @Post('logout')
  @ApiOperation({summary: '로그아웃', description: '로그아웃을 진행합니다.'})
  @ApiCreatedResponse({description: 'true'})
  @ApiResponse({status:400, description: 'BadRequest'})
  @ApiResponse({status:401, description: 'Unauthorized'})
  @ApiBearerAuth()
  @UseGuards(BearerTokenGuard)
  async logout(@Res() res:Response){
    tokenDeleteToCookies(res, "refresh_token")    
    res.json({
      status: true,
      massege: "Refresh Token 쿠키 만료"
    })
  }

  

  

  

}
