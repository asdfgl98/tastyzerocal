import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks'
import { FavoriteList, MapInfoState } from '../../model/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import { kakaoCategorySearch } from '../../utils/kakao-Utils'
import { addFavorite, checkFavorite, deleteFavorite } from '../../utils/foodDetailTap-Utils'
import FoodCard from './FoodCard'


interface OwnProp {
  setClickDetailTap(data: string): void
}

const FoodDetailTap:React.FC<OwnProp> = ({setClickDetailTap}) => {
    const mapInfo = useAppSelector((state)=>state?.kakaomapData.mapInfo)


  return (
    <div className="food-detail-list">
        {mapInfo?.map((item: MapInfoState)=> (
          <FoodCard item={item} setClickDetailTap={setClickDetailTap} isMyPage={false}/>
        ))}
    </div>
  )
}

export default FoodDetailTap