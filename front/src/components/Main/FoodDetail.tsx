import React, { forwardRef } from 'react'
import "./FoodDetail.css"
import FoodDetailSearch from './FoodDetailSearch'
import FoodDetailTap from './FoodDetailTap'

interface OwnProp {
  setClickDetailTap(data: string): void
}

const FoodDetail:React.FC<OwnProp> =({setClickDetailTap}) => {
  return (
    <div className="food-detail-container">
        <FoodDetailSearch />
        <FoodDetailTap setClickDetailTap={setClickDetailTap}/>
    </div>
  )
}

export default FoodDetail