import React, { useEffect, useRef, useState } from 'react'
import "./UserFoodData.css"
import FavoriteList from './MyPageList/FavoriteList'
import ReviewList from './MyPageList/ReviewList'
import LikeList from './MyPageList/LikeList'
import { userDataList } from '../../model/types'
import { useAppSelector } from '../../Store/hooks/hooks'
import { getUserDataList } from '../../utils/user-Utils'


const UserFoodData = () => {
    const userData = useAppSelector((state)=>state.userData)
    const accessToken= useAppSelector((state)=>state.tokenData.accessToken)
    const favoriteRef = useRef<HTMLDivElement>(null)
    const reviewRef = useRef<HTMLDivElement>(null)
    const likeRef = useRef<HTMLDivElement>(null)
    const [type, setType] = useState<string>('f')
    const [userDataList ,setUserDataList] = useState<userDataList>()
    const choiceDataTap = (choice: string)=>{
        setType(choice)        
    }

    useEffect(()=>{
        if(userData.id !== ""){
          getUserDataList(userData.id, accessToken).then((data: any)=>{
            console.log(data)
            setUserDataList(data)
          })
        }
      },[userData])

    const changeType = (type: string)=>{
        if(type === "f"){
            return <FavoriteList userDataList={userDataList!} setUserDataList={setUserDataList}/>
        }
        else if (type === "r"){
            return <ReviewList userDataList={userDataList!} setUserDataList={setUserDataList}/>
        }
        else if (type === "l"){
            return <LikeList userDataList={userDataList!} setUserDataList={setUserDataList}/>
        }
    }


    useEffect(()=>{
        if(type === "f"){
            reviewRef.current!.className = ""
            likeRef.current!.className = ""
            favoriteRef.current!.className = "food-data-click"
        }
        else if (type === "r"){
            favoriteRef.current!.className = ""
            likeRef.current!.className = ""
            reviewRef.current!.className = "food-data-click"
        }
        else if (type === "l"){
            favoriteRef.current!.className = ""
            reviewRef.current!.className = ""
            likeRef.current!.className = "food-data-click"
        }
        changeType(type)
    },[type])


  return (
    <div className='food-data-container'>        
        <div className='food-data-tap'>
            <div className="food-data-click" ref={favoriteRef} onClick={()=>choiceDataTap('f')}>즐겨찾기</div>
            <div ref={reviewRef} onClick={()=>choiceDataTap('r')}>작성한 리뷰</div>
            <div ref={likeRef} onClick={()=>choiceDataTap('l')}>좋아요</div>
        </div>
        <div className='food-data-list'>
            {changeType(type)}
        </div>
    </div>
  )
}

export default UserFoodData