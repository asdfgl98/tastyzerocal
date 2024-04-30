import React, { useEffect } from 'react'
import "./myPageList.css"
import Card from 'react-bootstrap/Card';
import { userDataList } from '../../../model/types';
import FoodCard from '../../Main/FoodCard';


interface OwnProp {
  userDataList: userDataList
  setUserDataList(data: any): void
}

const FavoriteList:React.FC<OwnProp> = ({userDataList, setUserDataList}) => {
  const setUserData = (data:any)=>{}

  return (
    <div className='mypage-list-container'>
      <div className='mypage-list-card-box'>
      {userDataList?.favoriteList?.map((item)=>(
        <FoodCard key={item.id} item={item} setClickDetailTap={setUserData} isMyPage={true}/>
      ))}
      </div>
    </div>
  )
}

export default FavoriteList