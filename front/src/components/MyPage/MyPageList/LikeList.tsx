import React from 'react'
import "./myPageList.css"
import CardList from './CardList'
import { useAppSelector } from '../../../Store/hooks/hooks'

const LikeList = () => {
  const {likeList} = useAppSelector((state)=>state.userData)
  console.log(likeList)
  return (
    <div className='mypage-list-container'>
      <div className='mypage-list-card-box'>
        <CardList/>
        <CardList/>
        <CardList/>        
        <CardList/>        
      </div>
    </div>
  )
}

export default LikeList