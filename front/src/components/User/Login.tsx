import React, { useEffect, useRef } from 'react'
import "./User.css"
import { Link, useNavigate } from 'react-router-dom'
import { dbAxios, kakaoAxios } from '../../model/axios'
import { useAppDispatch } from '../../Store/hooks/hooks'
import { setToken } from '../../Store/reducer/accessTokenSlice'

interface OwnProp {
    userPage: boolean
    setUserPage(data: boolean): void
  }

const Login:React.FC<OwnProp> = ({userPage, setUserPage}) => {
    // url에서 파라미터 추출
    const query = new URLSearchParams(window.location.search).get("code")
    const idRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigator = useNavigate()
    const dispatch = useAppDispatch()
    /** 카카오 로그인 클릭 함수 */
    const kakaoLoginClick = async():Promise<void>=>{
        const response = await kakaoAxios.get('/kakao-login/page')
        window.location.href = response.data
    }

    /** 카카오 로그인 Redirect Code 추출 및 Backend 요청 함수*/
    const kakaoLoginCallBack = async(): Promise<void>=>{
        try{
            const { data } = await kakaoAxios.get('/kakao-login/callback',{params:{
                code: query
            }})
            if(data.status){
                dispatch(setToken(data.accessToken))
                navigator('/')
            }
            else{
                alert("카카오 로그인 실패")
                navigator('/user')
    
            }
        } catch(err){
            console.log('카카오 로그인 에러 발생', err)
            alert("카카오 로그인 실패")
            navigator('/user')
        }
    }

    const clickLogin = async()=>{
        const id = idRef.current!.value
        const password = passwordRef.current!.value
        const encodedIdPassword = btoa(`${id}:${password}`)
        if(id === "" || password === ""){
            alert("아이디와 비밀번호를 입력해주세요.")
        } else {
            try{
                const response = await dbAxios.post('/auth/login', null, {
                    headers: {
                        Authorization: `Basic ${encodedIdPassword}`
                    }
                })
                if(response){
                    dispatch(setToken(response.data.accessToken))
                    navigator('/')
                } 
            } catch(err: any){
                if(err.response.data.error === "Unauthorized"){
                    const errMessage = err.response.data.message.split(":")[1]
                    alert(errMessage)
                }
            }            
        }        
    }

    useEffect(()=>{
        if(query){
            kakaoLoginCallBack()
        }
    },[query])



  return (
    <div className='user-form'>
        <h3 style={{marginBottom : "2rem"}}>로그인</h3>
        <div className='login-coment'>
            <span>로그인을 통해 맛있으면 0칼로리의 서비스를 이용해보세요.</span>
        </div>
        <div className='login-container'>
            <input type="text" placeholder='아이디를 입력해주세요.' ref={idRef} onKeyDown={(e)=> {if(e.key ==="Enter"){clickLogin()}}}/>
            <input type="password" placeholder='비밀번호를 입력해주세요.' ref={passwordRef} onKeyDown={(e)=> {if(e.key ==="Enter"){clickLogin()}}}/>
            <button onClick={clickLogin}>로그인</button>
            <div className="other-box">
                <Link to={""} style={{minWidth: "100px", textAlign : "right", color:"gray"}} onClick={()=>setUserPage(!userPage)}>회원가입</Link>
                <span style={{marginLeft : "5px", marginRight: "5px"}}>|</span>
                <Link to={""} style={{minWidth: "100px", color:"gray"}}>비밀번호 찾기</Link>
            </div> 
            <div className='social-login-container'>
                <img src={"./images/kakao_login_medium_wide.png"} alt="카카오 로그인" onClick={kakaoLoginClick}/>
            </div>
        </div>
    </div>
  )
}

export default Login