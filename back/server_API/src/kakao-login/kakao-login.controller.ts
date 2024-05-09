import { Body, Controller, Get, Header, Post, Query, Redirect, Res } from '@nestjs/common';
import { KakaoLoginService } from './kakao-login.service';
import { Response } from 'express';
import axios from 'axios';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('kakao-login')
@ApiTags('kakao-login Controller')
export class KakaoLoginController {
  constructor(private readonly kakaoLoginService: KakaoLoginService) {}

  /** 카카오 로그인 URL 프론트로 전송 */
  @Get("/page")
  @ApiOperation({summary: '카카오 로그인 URL 요청', description: '카카오 로그인 URL 프론트로 전송'})
  @ApiOkResponse({description: "카카오 로그인 URL"})
  LoginPage(){
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code`
    return url
  }

  /** 카카오 로그인 api*/
  @Get("/callback")
  @ApiOperation({summary: "카카오 로그인 API", description: "OAuth2.0 카카오 로그인을 진행합니다."})
  @ApiOkResponse({description: "accessToken | refreshToken"})
  async LoginRedirect(
    @Query('code') code: string,
    @Res() res: Response
  ){
    const token = await this.kakaoLoginService.getToken(code)
    const userData = await this.kakaoLoginService.getUserData(token.access_token)
    const response = await this.kakaoLoginService.JoinWithKakao(userData, token)
    res.cookie('refresh_token', response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    })

    res.json({
      accessToken : response.accessToken,
      status: true
    })

  }

  /** 카카오 회원 탈퇴 */
  @Post('unLink')
  @ApiOperation({summary: "카카오 로그인 회원 탈퇴", description: "OAuth2.0 카카오 로그인한 유저가 탈퇴를 진행합니다."})
  @ApiOkResponse({description: "success"})
  async unLinkKakao(@Body('accessToken') accessToken: string){
    return await this.kakaoLoginService.unLinkKakao(accessToken)
  }
  
}
