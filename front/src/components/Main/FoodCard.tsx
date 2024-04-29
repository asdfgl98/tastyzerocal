import React from 'react'
import "./FoodDetail.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark as faSolid} from '@fortawesome/free-solid-svg-icons'
import { faBookmark as faRegular} from '@fortawesome/free-regular-svg-icons'
import { kakaoCategorySearch } from '../../utils/kakao-Utils'
import { FavoriteList, MapInfoState } from '../../model/types'
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks'
import { addFavorite, checkFavorite, deleteFavorite } from '../../utils/foodDetailTap-Utils'

type Map = MapInfoState | FavoriteList

interface OwnProp {
    item: Map
    setClickDetailTap(data: any): void
    isMyPage: boolean
}

const FoodCard:React.FC<OwnProp> = ({item, setClickDetailTap, isMyPage}) => {
    const dispatch = useAppDispatch()
    const userInfo = useAppSelector((state)=>state.userData)
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)

    /** 선택한 음식점 주변 검색 함수 */
    const aroundSearch = (data:{ lat: number,lng: number})=>{
        kakaoCategorySearch(data, dispatch)
      }

  return (
    <div className='food-detail-card' key={item.id} data-name={item.id} onClick={()=>setClickDetailTap(item.id)}>
    <span className='store-name'>{item.place_name}</span> 
    <span className="store-cate">{item.category_name.split(' ')[item.category_name.split(' ').length-1]}</span>
    {  checkFavorite(item.id, userInfo.favoriteList) ?
      <FontAwesomeIcon icon={faRegular} size='xl' color='green' className='icon-favorite' onClick={()=>addFavorite(item, userInfo, accessToken, dispatch)}/>
      :
      <FontAwesomeIcon icon={faSolid} size='xl' color='green' className='icon-favorite' onClick={()=>deleteFavorite(item, userInfo, accessToken, dispatch)}/>
    } 
    <p>🗺️ {item.road_address_name}</p>
    <p>🍳 {item.category_name.split(' ')[2]}</p>
    <p>📞 {item.phone !== ""? item.phone : "정보 없음"}</p>
    <a href={item.place_url} target='_blank' >📜상세 보기</a><br/>
    {isMyPage === true ? null : <span onClick={()=>aroundSearch({lat: Number(item.y), lng :Number(item.x)})} style={{cursor: "pointer"}}>🔍 "{item.place_name}" 근처 맛집 찾아보기</span>}
</div>
  )
}

export default FoodCard