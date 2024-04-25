import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks'
import { FavoriteList, MapInfoState } from '../../model/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import { kakaoCategorySearch } from '../../utils/kakao-Utils'
import { addFavorite, checkFavorite, deleteFavorite } from '../../utils/foodDetailTap-Utils'


interface OwnProp {
  setClickDetailTap(data: string): void
}

const FoodDetailTap:React.FC<OwnProp> = ({setClickDetailTap}) => {
    const mapInfo = useAppSelector((state)=>state?.kakaomapData.mapInfo)
    const userInfo = useAppSelector((state)=>state.userData)
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)
    const dispatch = useAppDispatch()

    /** 선택한 음식점 주변 검색 함수 */
    const aroundSearch = (data:{ lat: number,lng: number})=>{
      kakaoCategorySearch(data, dispatch)
    }

  return (
    <div className="food-detail-list">
        {mapInfo?.map((item: MapInfoState)=> (
            <div className='food-detail-card' key={item.id} data-name={item.place_name} onClick={()=>setClickDetailTap(item.place_name)}>
                <span className='store-name'>{item.place_name}</span> 
                <span className="store-cate">{item.category_name.split(' ')[item.category_name.split(' ').length-1]}</span>
                {  checkFavorite(item.id, userInfo.favoriteList) ?
                  <FontAwesomeIcon icon={faHeartRegular} size='xl' color='red'className='icon-favorite' onClick={()=>addFavorite(item, userInfo, accessToken, dispatch)}/>
                  :
                  <FontAwesomeIcon icon={faHeartSolid} size='xl' color='red'className='icon-favorite' onClick={()=>deleteFavorite(item, userInfo, accessToken, dispatch)}/>
                } 
                <p>🗺️ {item.road_address_name}</p>
                <p>🍳 {item.category_name.split(' ')[2]}</p>
                <p>📞 {item.phone !== ""? item.phone : "정보 없음"}</p>
                <a href={item.place_url} target='_blank' >📜상세 보기</a><br/>
                <span onClick={()=>aroundSearch({lat: Number(item.y), lng :Number(item.x)})} style={{cursor: "pointer"}}>🔍 "{item.place_name}" 근처 맛집 찾아보기</span>
            </div>
        ))}
    </div>
  )
}

export default FoodDetailTap