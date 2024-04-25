import React, { useRef, useState } from 'react'
import './FoodList.css'
import KakaoMap from '../Map/KakaoMap'
import FoodDetail from './FoodDetail'

interface OwnProp {
}
  

const FoodList:React.FC<OwnProp> = () => {
  const [clickDetailTap, setClickDetailTap] = useState<string>("")
  return (
    <div className="food-list-container">
        <div className="food-list-box">
            <FoodDetail setClickDetailTap={setClickDetailTap}/>
            <KakaoMap clickDetailTap={clickDetailTap} containerCSS={"map-container"} mapCSS={"mapStyle"}/>
        </div>

    </div>
  )
}

export default FoodList