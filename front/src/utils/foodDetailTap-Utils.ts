import { setUserData } from "../Store/reducer/userDataSlice"
import { dbAxios } from "../model/axios"
import { FavoriteList } from "../model/types"
import { tokenErrorHandling } from "./JWT-Utils"

/** 즐겨찾기 추가 */    
export const addFavorite = async(item: any, userInfo:any, accessToken: string, dispatch: any)=>{
    const {id, place_name, category_name, road_address_name, phone, place_url} = item
    if(userInfo.name !== ""){
      const confirmChoice = window.confirm("즐겨찾기에 추가하시겠습니까?")
      if(confirmChoice){
        try{
          const response = await dbAxios.post('/users/favorite', {
            id, place_name, category_name, road_address_name, phone, place_url
          },{
            headers: {
              "Authorization" : `Bearer ${accessToken}`
            }
          })
          dispatch(setUserData({
            ...userInfo,
            favoriteList : response.data
          }))

        } catch(err: any) {
          tokenErrorHandling(err)
          console.error(`즐겨찾기 추가 에러 발생`, err.response.data)
        }
      }
    } else {
      alert("로그인 후 이용하실 수 있는 기능입니다.")
    }
  }

  /** 즐겨 찾기 제거 */
  export const deleteFavorite = async(item: any, userInfo:any, accessToken: string, dispatch: any)=>{
    if(userInfo.name !== ""){
      const confirmChoice = window.confirm("즐겨찾기를 해제 하시겠습니까?")
      if(confirmChoice){
        try{
          const response = await dbAxios.delete(`/users/favorite/${item.id}`, {
            headers: {
              "Authorization" : `Bearer ${accessToken}`
            }
          })
          console.log(response.data)
          dispatch(setUserData({
            ...userInfo,
            favoriteList : response.data
          }))

        } catch(err: any) {
          tokenErrorHandling(err)
          console.error(`즐겨찾기 해제 에러 발생`, err.response.data)
        }
      }
    } else {
      alert("로그인 후 이용하실 수 있는 기능입니다.")
    }
  }

  /** 즐겨찾기 클릭 유무 검사 함수 */
  export const checkFavorite = (storeid: string, favoriteList: FavoriteList[])=>{
    for(let i=0; i<= favoriteList.length; i++){
      if(favoriteList[i]?.id === storeid){
        return false
      } 
    }
    return true
  }