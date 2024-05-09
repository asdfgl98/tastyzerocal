import React, { useEffect, useState } from 'react'
import "./OtherRegionModal.css"
import { RegionState } from '../../model/types'
import { searchStore } from '../Main/FoodDetailSearch'
import { useAppDispatch } from '../../Store/hooks/hooks'
import { changeKeyword } from '../../Store/reducer/mapInfoSlice'

interface OwnProp {
    regionData?: RegionState[]
    setORModal(data: boolean): void
    ORModal: boolean
}

const OtherRegionModal:React.FC<OwnProp> = ({regionData,  setORModal, ORModal}) => {
    // 지역 이름(서울, 대구)
    const [regionChoice, setRegionChoice] = useState<string>()
    // 시군구 이름(강서구, 강남구)
    const [cityChoice, setCityChoice] = useState<string>("")
    // 시군구 전체 데이터
    const [cityData, setCityData] = useState<string[]>()
    const dispatch = useAppDispatch()

    /** 검색 버튼 클릭 함수 */
    const searchBtn = ()=>{
        if(regionChoice !== undefined){
            let data = `${regionChoice} ${cityChoice}`
            searchStore(data, dispatch)
            dispatch(changeKeyword(data))

            
        }
        else{
            alert("지역을 선택해주세요.")
        }        
    }

    /** 시도군 클릭 함수 */
    const cityClick = (city: string)=>{
        setCityChoice(city)
    }

    /** 지역 클릭 함수 */
    const regionClick = (region: string) =>{
        setRegionChoice(region)
        setCityChoice("")
    }

    // 선택한 지역에 대한 시/도/군 데이터 필터링
    useEffect(()=>{
        if(regionChoice !== undefined){
            let data = regionData?.filter((arr)=>arr.koreaRegion === regionChoice)
            setCityData(data![0].city)
        }
    },[regionChoice])


  return (
    <div className={ORModal ? 'modal-container active-content' : "modal-container inactive-content"}>
        <div className="region-box">
            <p>지역</p>
            <div className='region-list'>
                {
                    regionData?.map((item)=>(
                        <button 
                        key={item._id} 
                        onClick={()=>regionClick(item.koreaRegion)}
                        className={item.koreaRegion === regionChoice ? 'btn-active' : ''}
                        >{item.koreaRegion}</button>
                    ))
                }
            </div>
        </div>
        <div className="city-list">
            <p>시군구</p>
            <div className="city-detail">
                {cityData?.map((item, idx)=>(
                    <button key={idx} onClick={()=>cityClick(item)}>{item === cityChoice ? "✅" : ""} {item}</button>
                ))}
            </div>
            <div className='city-button'>
                <button className="search-btn" onClick={()=>searchBtn()}>검색</button>
                <button className="close-btn" onClick={()=>setORModal(false)}>닫기</button>
            </div>
        </div>

    </div>
  )
}

export default OtherRegionModal