import React from 'react'
import "./myPageList.css"
import Card from 'react-bootstrap/Card';
import { userDataList } from '../../../model/types';

interface OwnProp {
  userDataList: userDataList
  setUserDataList(data: any): void
}

const FavoriteList:React.FC<OwnProp> = ({userDataList, setUserDataList}) => {
  return (
    <div className='mypage-list-container'>
      <div>
        
      </div>
    </div>
  )
}

export default FavoriteList