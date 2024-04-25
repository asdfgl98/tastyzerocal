import React from 'react'
import "./myPageList.css"
import CardList from './CardList'

const LikeList = () => {
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