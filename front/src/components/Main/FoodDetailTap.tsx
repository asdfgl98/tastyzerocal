import React from 'react'
import {  useAppSelector } from '../../Store/hooks/hooks'
import {  MapInfoState } from '../../model/types'

import FoodCard from './FoodCard'


interface OwnProp {
  setClickDetailTap(data: string): void
}

const FoodDetailTap:React.FC<OwnProp> = ({setClickDetailTap}) => {
    const mapInfo = useAppSelector((state)=>state?.kakaomapData.mapInfo)


  return (
    <div className="food-detail-list">
      {mapInfo.length === 0 ? <div className='search-message'><p>검색 결과가 없습니다🥲</p></div> :
       mapInfo?.map((item: MapInfoState)=> (
        <FoodCard key={item.id} item={item} setClickDetailTap={setClickDetailTap} isMyPage={false}/>
      ))
      }
    </div>
  )
}

export default FoodDetailTap