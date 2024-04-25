import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { LatLng, MapInfoState } from "../../model/rpc";

export interface RootState {
    mapInfo: MapInfoState[]
    latLng: LatLng
    keywordSearch: string
    otherRegion: boolean
    regionName: string
    reviewData: MapInfoState
}

const initialState: RootState  = {
    mapInfo: [],
    latLng: {lat: 35.15774631887322, lng: 126.88156419757567},
    keywordSearch: "",
    otherRegion: false,
    regionName: "광주",
    reviewData: {} as MapInfoState
}

export const mapInfoSlice = createSlice({
    name: "kakaoMapData",
    initialState,
    reducers: {
        /** 음식점 정보 데이터 변경 */
        setMapInfo:(state, action: PayloadAction<MapInfoState[]>)=>{
            if(state.mapInfo !== action.payload){
                state.mapInfo = action.payload
            }
        },
        /** 카카오맵 중심 위치 변경 */
        changeLocation:(state, action: PayloadAction<LatLng>)=>{
            state.latLng = action.payload
        },
        /** 검색 키워드 창 값 변경 */
        changeKeyword:(state, action: PayloadAction<string>)=>{
            state.keywordSearch = action.payload
        },
        /** 다른 지역 검색 시, 해당 지역 이름*/
        changeRegionName:(state, action: PayloadAction<string>)=>{
            state.regionName = action.payload
        },
        /** 리뷰용 가게 정보 저장 */
        storeDataSaveForReview:(state, action: PayloadAction<MapInfoState>)=>{
            state.reviewData = action.payload
        }
    }
})

export const  {setMapInfo, changeLocation,changeKeyword, changeRegionName, storeDataSaveForReview} = mapInfoSlice.actions
export default mapInfoSlice.reducer