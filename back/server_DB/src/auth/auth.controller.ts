import { Body, Controller, Delete, Get, Headers, Post, Req, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import {  Response } from 'express';
import { BasicTokenGuard } from 'src/guard/basic-token.guard';
import { User } from 'src/decorator/auth.decorator';
import { BearerTokenGuard} from 'src/guard/bearer-token.guard';
import { CookieTokenGuard } from 'src/guard/Cookie-token.guard';
import { HttpExceptionFilter } from 'src/exception-filter/http.exception-filter';
import { tokenCreateForCookies, tokenDeleteToCookies } from 'src/Utils/JWT-Utils';


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService
  ) {}

  /** access 토큰 재발급 엔드포인트 */
  @Post('token/access')
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
  @UseGuards(BearerTokenGuard)
  async logout(@Res() res:Response){
    tokenDeleteToCookies(res, "refresh_token")    
    res.json({
      status: true,
      massege: "Refresh Token 쿠키 만료"
    })
  }

  /** 일반 회원가입 엔드포인트 */
  @Post('join')
  async joinWithId
  (@Body() createUserDto: CreateUserDto,
  @Res() res: Response
  ){
    const result = await this.authService.Join(createUserDto)
    tokenCreateForCookies(res, 'refresh_token', result)    
  }

  /** 소셜 회원가입 엔드포인트*/
  @Post('social-join')
  async joinWithSocial(@Body() createSocialDTO: CreateUserDto){
    return await this.authService.Join(createSocialDTO)
  }

  

  

}
