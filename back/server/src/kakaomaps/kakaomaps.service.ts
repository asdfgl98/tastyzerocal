import { Injectable } from '@nestjs/common';
import axios from 'axios';

/* 카카오맵 음식점 API 데이터 타입 */
export interface MapInfoState {
    address_name: string
    category_group_code: string
    category_group_name: string
    category_name: string
    distance: string
    id: string
    phone: string
    place_name: string
    place_url: string
    road_address_name: string
    x: string
    y: string
  }

@Injectable()
export class KakaomapsService {
  /** 검색어로 음식점 데이터 호출 카카오 API */
    async keywordSearch (searchWord: string): Promise<MapInfoState[]> {
      try{
        const query = `	https://dapi.kakao.com/v2/local/search/keyword.json?query=${searchWord}&category_group_code=FD6`
        const response = await axios.get(query, {
          headers: {
            "Authorization": `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
          }
        })    
        return response.data
      } catch(err){
        if (axios.isAxiosError(err)) {
          // axios 에러 발생인 경우
          console.error('kakao keywordSearch API 요청 중 에러 발생(Axios)', err.response?.status, err.response?.data)
        } else {
          console.error('kakao keywordSearch API 요청 중 에러 발생(기타)', err.message)
        }
      }
    }

    /** 카테고리(음식점) 데이터 호출 카카오 API */
    async categorysearch (data: {x: string, y: string}): Promise<MapInfoState[]> {
      try{
        const query = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=FD6&x=${data.x}&y=${data.y}`
        const response = await axios.get(query, {
          headers: {
            "Authorization": `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
          }
        })
        return response.data
      } catch (err){
        if(axios.isAxiosError(err)){
          // axios 에러 발생인 경우
          console.error('kakao keywordSearch API 요청 중 에러 발생(Axios)', err.response?.status, err.response?.data)
        } else {
          console.error('kakao keywordSearch API 요청 중 에러 발생(기타)', err.message)
        }
      }
    }
}


