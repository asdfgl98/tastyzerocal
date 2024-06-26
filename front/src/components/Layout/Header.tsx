import React from 'react'
import './Layout.css'
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';
import {resetToken} from '../../Store/reducer/accessTokenSlice'
import { logOut } from '../../Store/reducer/userDataSlice';
import { dbAxios } from '../../model/axios';

const Header:React.FC = () => {
    const dispatch = useAppDispatch()
    const data = useAppSelector((state)=>state.userData)
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)

    /** 로그아웃 함수 */
    const userlogOut = async ()=>{
        try{
            const response = await dbAxios.post('/auth/logout', null, {
                headers: {
                    "Authorization" : `Bearer ${accessToken}`
                }
            })
            dispatch(resetToken())
            dispatch(logOut())
        } catch(err){
            console.error("로그아웃 에러 발생", err)
        }

    }

    

  return (
    <div className='header'>
        <div className='navBar'>
            <div className='header-item'>
                <Link to={"/"} className="header-main">
                    <img
                        alt=""
                        src="/logo.ico"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        />{' '}
                        <span className='main-name'>맛있으면 0칼로리</span>
                </Link>
            </div>
            <div className='header-item'>
                <Link to={"/review"} className="header-link">리뷰 게시판</Link>
            </div>
            <div>
                <div className='header-item'>
                    {data.name === "" ? 
                    <Link to={"/user"} className="header-link">로그인</Link>
                    :
                    <div>
                    <Link to={"/mypage"} className="header-link" >{data.name} 님</Link>
                    <Link to={"/"} className="header-link" onClick={userlogOut}>로그아웃</Link>
                    </div>
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default Header