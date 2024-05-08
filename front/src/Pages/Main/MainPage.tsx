import React, { useEffect, useState } from 'react'
import LocationChoice from '../../components/Main/LocationChoice'
import {RegionState} from '../../model/types'
import FoodList from '../../components/Main/FoodList';
import "./MainPage.css"
import { dbAxios } from '../../model/axios';
import OtherRegionModal from '../../components/Modal/OtherRegionModal';
import Footer from '../../components/Layout/Footer';
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';
import { kakaoCategorySearch } from '../../utils/kakao-Utils';


const MainPage:React.FC = () => {
    // 대한민국 지역 데이터
    const [regionData, setRegionData] = useState<RegionState[]>()
    // 다른 지역 맛집 찾아보기 Modal 상태
    const [ORModal, setORModal] = useState<boolean>(false)
    const latLng = useAppSelector((state)=>state.kakaomapData.latLng)
    const dispatch = useAppDispatch()
    /** 대한민국 지역 데이터 DB에서 불러오는 함수 */
    const getRegionData = async(): Promise<void>=>{
      try{
        const response = await dbAxios.get('/resource/region')
        setRegionData(response.data)
      } catch (err){
        console.error('Region 데이터 조회 에러', err)
      }
    }    
    
    useEffect(()=>{
      // kakaomap 카테고리(음식점)별 데이터 요청 함수
      kakaoCategorySearch(latLng, dispatch)
      // 대한민국 지역 데이터
      getRegionData()     
    },[])

 

  return (
    <div className='main-page'>
        <LocationChoice ORModal={ORModal} setORModal={setORModal}/>
        <OtherRegionModal regionData={regionData} ORModal={ORModal} setORModal={setORModal}/>
        <FoodList/>
        <Footer/>
    </div>
  )
}

export default MainPage