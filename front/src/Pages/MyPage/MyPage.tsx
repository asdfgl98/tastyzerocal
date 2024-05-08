import React, { useEffect, useRef, useState } from 'react'
import "./MyPage.css"
import { useAppSelector } from '../../Store/hooks/hooks'
import UserFoodData from '../../components/MyPage/UserFoodData'
import UserEdit from '../../components/MyPage/UserEdit'

const MyPage = () => {
    const userData = useAppSelector((state)=>state.userData)  
    const foodDataRef = useRef<HTMLDivElement>(null)
    const userEditRef = useRef<HTMLDivElement>(null)
    const [mypageTap, setMyPageTap] = useState<boolean>(true)
    
    const mypageTapClick = (check: boolean)=>{

      if(check){
        userEditRef.current!.className = ""
        foodDataRef.current!.className = "choice-tap"
        setMyPageTap(check)
        
      }
      else{
        userEditRef.current!.className = "choice-tap"
        foodDataRef.current!.className = ""
        setMyPageTap(check)
      }
    }

    

  return (
    <div className='mypage-container'>
        <div className='mypage-box'>
            <div className='mypage-tap'>
                <div onClick={()=>mypageTapClick(true)} ref={foodDataRef} className="choice-tap">{userData.name}님의 먹거리</div>
                <div onClick={()=>mypageTapClick(false)} ref={userEditRef}>회원정보 수정</div>
            </div>
            {mypageTap ? <UserFoodData/> : <UserEdit userData={userData}/>}
        </div>
    </div>
  )
}

export default MyPage