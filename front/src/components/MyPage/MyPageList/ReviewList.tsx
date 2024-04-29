import React from 'react'
import "./myPageList.css"
import { userDataList } from '../../../model/types'

interface OwnProp {
  userDataList: userDataList
  setUserDataList(data: any): void
}

const ReviewList:React.FC<OwnProp> = ({userDataList, setUserDataList}) => {
  return (
    <div className='mypage-list-container'>
      
    </div>
  )
}

export default ReviewList