import { setToken } from "../Store/reducer/accessTokenSlice"
import { setUserData } from "../Store/reducer/userDataSlice"
import { dbAxios } from "../model/axios"

/** accessToken으로 유저 정보 가져오는 함수 */
export const getUserDataWithToken = async(dispatch:any ,accessToken:string)=>{
    try{
        const {data} = await dbAxios.get('/auth/userInfo', {
          headers: {
            "Authorization" : `Bearer ${accessToken}`
          }
        })
        dispatch(setUserData(data))
    } catch(err:any){
      tokenErrorHandling(err) 
    }
  }

  /** RefreshToken으로 accessToken 갱신 함수 */
  export const getAccessTokenWithRefreshToken = async(dispatch:any)=>{
    try{
      const {data} = await dbAxios.post('/auth/token/access',{
        isRefreshToken : true
      })
      if(data.accessToken){
        dispatch(setToken(data.accessToken))
        return data.accessToken
      }
      else{
        console.log("로그인을 해주세요")
      }
    } catch(err: any){
      tokenErrorHandling(err)
    }
  }

  /** 토큰 에러 핸들링 함수 */
  export const tokenErrorHandling = (err: any)=>{
    console.log(err)
    const error = err.response?.data.error.error
    if(error === "RefreshExpired"){
      alert("엑세스가 만료되었습니다. 다시 로그인해주세요.")
    }
    else if(error === "AccessExpired"){
      console.log("엑세스 토큰 만료")
    }
  }

  /** 토큰 만료시간 검증 함수 */
  export const verifyJWTWithTime = (accessToken: string): boolean=>{
    const payload = accessToken.split(".")[1]
        const decoded = atob(payload)
        // 토큰 생성시간, 만료시간
        const {iat, exp} = JSON.parse(decoded)
        // 현재시간
        const currentTime = Math.floor(Date.now() / 1000)
        if(iat <= currentTime && exp >= currentTime){
            return true
        }        
        return false    
  }