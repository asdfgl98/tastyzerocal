import * as moment from "moment-timezone"
import { JWT } from "src/Types/type"


/** Cookie에 JWT 추가 함수 */
export const tokenCreateForCookies = (res:any, tokenName: string, token: JWT)=>{
    res.cookie(tokenName, token.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })

    return res.json({
        accessToken : token.accessToken,
        status: true
      })
}


/** Cookie에서 JWT 제거 함수*/
export const tokenDeleteToCookies = (res: any, tokenName: string)=>{
    res.clearCookie(tokenName,{
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7,        
      })
}

export const koreanTime = ()=>{ return moment.tz("Asia/Seoul").format("YYYY-MM-DD HH:mm:ss")}