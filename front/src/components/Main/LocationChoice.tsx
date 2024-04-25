import React, { useEffect, useState } from 'react'
import './LocationChoice.css'
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks'
import { changeKeyword, changeLocation } from '../../Store/reducer/mapInfoSlice'
import { kakaoCategorySearch } from '../../utils/kakao-Utils'

interface OwnProp {
    ORModal: boolean
    setORModal(data: boolean): void
}



const LocationChoice:React.FC<OwnProp> = ({ ORModal, setORModal}) => {
    const dispatch = useAppDispatch()
    const region = useAppSelector((state)=>state.kakaomapData.regionName)
    /* 사용자 좌표 얻어오는 함수 */
    const getLocation = ()=>{
       navigator.geolocation.getCurrentPosition((pos: GeolocationPosition)=>{
        let lat = pos.coords.latitude
        let lng = pos.coords.longitude
        const latLng = {
            lat : lat,
            lng : lng
        }
        dispatch(changeLocation({lat: lat, lng: lng}))
        dispatch(changeKeyword(""))
        kakaoCategorySearch(latLng, dispatch)
       })
    }


  return (
    <div className="location-box">
        <div className="location-text">
            <p className='headline1'>세상에 모든 맛집은 맛영칼에서</p>
            <p className='headline2'>오늘의<span className="regionName">{region}</span> 맛집은?</p>
        </div>
        <div>
            <button className="location-button" onClick={()=>setORModal(!ORModal)}>다른 지역 맛집 찾아보기</button>
            <button className="location-button" onClick={getLocation}>내 주변 맛집 찾아보기</button>
        </div>
    
    </div>
  )
}

export default LocationChoice