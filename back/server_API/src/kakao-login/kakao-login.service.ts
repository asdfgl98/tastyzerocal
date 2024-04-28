import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { ENV_DB_SERVER_ORIGIN_KEY, ENV_KAKAO_REDIRECT_URI_KEY, ENV_KAKAO_REST_API_KEY_KEY } from 'src/common/const/env-keys.const';

@Injectable()
export class KakaoLoginService {
    constructor(private readonly configService: ConfigService){}
    /** 사용자 Code로 토큰 요청 함수 */
    async getToken(code: string): Promise<any>{
        const headers = {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
        const params = {
            grant_type: "authorization_code",
            client_id: this.configService.get<string>(ENV_KAKAO_REST_API_KEY_KEY),
            redirect_uri: this.configService.get<string>(ENV_KAKAO_REDIRECT_URI_KEY),
            code, 
        }

        try {
            // 사용자 Code로 카카오 Server에 access_token 요청
            const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {headers, params})
            const token = response.data           
            return token

        } catch(err){
            console.error('kakao login 토큰 발급 요청 오류', err)
        }
    }

    /** 발급받은 토큰으로 사용자 정보 요청 */
    async getUserData(access_token: string): Promise<any>{
        const accessHeader = {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            "Authorization" : `Bearer ${access_token}`
        }
        // 응답받은 access_token으로 사용자 정보 요청
        try{            
            const userDataResponse = await axios.post('https://kapi.kakao.com/v2/user/me', null , {headers: accessHeader}) 
             
            return userDataResponse

        } catch(err) {
            console.error('카카오 로그인 UserData 요청 오류', err)
        }
    }

    /** 카카오 유저 데이터로 회원가입 및 로그인 */
    async JoinWithKakao(userData: any, token: any): Promise<any>{
        const dbServer = this.configService.get<string>(ENV_DB_SERVER_ORIGIN_KEY)
        try{
            const joinResponse = await axios.post(`${dbServer}/auth/social-join`,{
                id: userData.data.id,
                password: userData.data.id,
                name: userData.data.properties.nickname,
                loginType: "K",
                token:{
                    accessToken: token.access_token,
                    refreshToken: token.refresh_token
                }
            })
            return joinResponse.data

        } catch(err){
            console.error('카카오 로그인 에러', err)
        }
    }

    /**카카오 회원 연결 끊기 */
    async unLinkKakao(accessToken: string){
        try{
            const unLink = await axios.post(`https://kapi.kakao.com/v1/user/unlink`,null,{
                headers:{
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            if(!unLink.data.id){
                throw new UnauthorizedException("unLinkKakao: 카카오 회원 탈퇴 에러")
            }
            
            return {
                status : true,
                message: "카카오 회원 탈퇴 완료"

            }
        } catch(err){
            console.log('카카오 회원 탈퇴 에러', err)
        }
    }
}
