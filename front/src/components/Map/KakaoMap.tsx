import React, { useEffect, useRef, useState } from 'react'
import "./KakaoMap.css"
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';
import { changeRegionName, setMapInfo } from '../../Store/reducer/mapInfoSlice';
import { kakaoAxios } from '../../model/axios';
import { displayInfowindow, kakaoCategorySearch } from '../../utils/kakao-Utils';

declare global {
  interface Window {
    kakao: any;
  }
}
interface OwnProp {
  clickDetailTap: string
  containerCSS: string
  mapCSS: string
}
export const KakaoMap:React.FC<OwnProp> = ({clickDetailTap, containerCSS, mapCSS}) => {
  const dispatch = useAppDispatch()
  const latLng = useAppSelector((state)=>state.kakaomapData.latLng)
  const data = useAppSelector((state)=>state.kakaomapData.mapInfo)
  const infowindowRef = useRef<any>([]); // 인포윈도우의 ref  

  

  // FoodDetailTap에서 음식점 클릭 시 카카오맵 인포윈도우 클릭 연동
  useEffect(()=>{
    if(clickDetailTap !== ""){
      const infoWindows = infowindowRef.current
      infoWindows.forEach((infoWindow: any)=>{
        if(infoWindow.dataset.name === clickDetailTap){
          infoWindow.click()
        }
      })
    }
  },[clickDetailTap])
  
  // KakaoMap 생성
  useEffect(() => {    
    // 기존의 map div 제거 후 재성성하여 지도 다시 그리기
    document.getElementById('map')?.remove()
    const newMapDiv = document.createElement('div')
    const div = document.getElementsByClassName(containerCSS)[0]
    newMapDiv.id = 'map'
    newMapDiv.className = mapCSS
    div.appendChild(newMapDiv) 

    // Kakao Map 생성 및 설정
    window.kakao?.maps.load( ()=>{
      // KakaoMap 설정
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(latLng.lat, latLng.lng), // 초기 중심 좌표 (위도, 경도)
        level: 15, // 지도 확대 레벨
      };
      // KakaoMap 생성
      const map = new window.kakao.maps.Map(container, options);
      // KakaoMap 라이브러리
      const places = new window.kakao.maps.services.Places();

      // 음식점 데이터로 인포윈도우 생성
      for (var i = 0; i < data.length; i++) {
        displayInfowindow(data[i], map, i, infowindowRef, dispatch);
      }
      // 지도 레벨(확대,축소) 변경
      map.setLevel(5)
      // 지도 중심 이동
      map.panTo(new window.kakao.maps.LatLng(latLng.lat, latLng.lng))
      // 첫번째 음식점 활성화(클릭)
      setTimeout(()=>{
        infowindowRef.current[0]?.click()
      }, 1000)
    })
    
  },[data])

     return (
    <div className={containerCSS}></div>
  )
}
      

export default KakaoMap;
