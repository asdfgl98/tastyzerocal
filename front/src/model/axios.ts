import axios from "axios";
import store from "../Store/store";
import { getAccessTokenWithRefreshToken, verifyJWTWithTime } from "../utils/JWT-Utils";
import { resetToken, setToken } from "../Store/reducer/accessTokenSlice";


export const kakaoAxios = axios.create({
    baseURL : process.env.REACT_APP_KAKAO_SERVER,
    withCredentials: true
})

export const dbAxios = axios.create({
    baseURL : process.env.REACT_APP_DB_SERVER,
    withCredentials: true
})

dbAxios.interceptors.request.use( async(config)=>{
    const {accessToken} = store.getState().tokenData
    if(accessToken !== ""){
        // token 만료 시간 검증 true / false
        const verify = verifyJWTWithTime(accessToken)
        // token이 만료 되었다면
        if(!verify){
            // 해당 axios 요청 무한 루프 방지 accessToken 초기화
            store.dispatch(resetToken())
            // accessToken 재발급 함수
            const accessTokenRefresh = await getAccessTokenWithRefreshToken(store.dispatch)
            // 헤더의 만료된 accessToken -> 재발급 받은 accessToken으로 변경
            config.headers["Authorization"] = `Bearer ${accessTokenRefresh}`
        }
    }
    return config
},(err)=>{
})

// dbAxios.interceptors.response.use(
//     (res)=> res,
//     (err)=> {
//         const {status} = err.response
//         const {error, statusCode} = err.response.data
//         console.log(err)
//         return {
//             data: {
//                 isError: true,
//                 errorType: error,
//                 errorCode: statusCode
//             }
//         }
//     }

// )