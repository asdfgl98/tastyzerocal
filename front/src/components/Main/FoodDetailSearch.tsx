import React, { useRef } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { kakaoAxios } from '../../model/axios';
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';
import { changeKeyword, changeLocation, changeRegionName, setMapInfo } from '../../Store/reducer/mapInfoSlice';

 /** 검색어 입력 시 카카오 api 호출 / 검색어 기반 응답 받은 데이터로 redux 변수 수정*/
export const searchStore = async(searchWord: string, dispatch: any)=>{
  try{
    const response = await kakaoAxios.get(`/kakaomaps/keywordSearch?searchword=${searchWord}`)
    dispatch(changeLocation({lat: Number(response.data.documents[0].y), lng: Number(response.data.documents[0].x)}))
    dispatch(changeRegionName(response.data.documents[0].address_name.split(" ")[0]))
    dispatch(setMapInfo(response.data.documents))
  } catch (err) {    
    console.error("kakaoMap Searching Error", err)
    dispatch(setMapInfo([]))
  }
}

const FoodDetailSearch:React.FC = () => {
  const dispatch = useAppDispatch()
  const keyword = useAppSelector((state)=>state.kakaomapData.keywordSearch)
  const inputRef = useRef<HTMLInputElement>(null) 

  const handleChange = (e: any)=>{
    dispatch(changeKeyword(e.target.value))
  }

  /** 검색 버튼 클릭 실행 함수 */
  const searchMap = ():void =>{
    const searchWord = inputRef.current!.value.trim()
    if(searchWord !== ""){
      searchStore(searchWord, dispatch)        
    }
    else{
      alert("검색어를 입력 해주세요.")
      inputRef.current!.value = ""
    }
  }

  return (
    <div className="food-detail-search-box">
        <div className="search-container">
            <input 
              className="input-style" 
              value={keyword} 
              onChange={handleChange}
              onKeyDown={(e)=> {if(e.key ==="Enter"){searchMap()}}}
              type="text" 
              placeholder='상호명, 지역, 장소 검색' 
              ref={inputRef}/>
            <FontAwesomeIcon icon={faSearch} className="search-click" onClick={searchMap}/>

        </div>
    </div>
  )
}

export default FoodDetailSearch