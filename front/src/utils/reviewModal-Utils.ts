import { dbAxios } from "../model/axios"
import { ReviewData } from "../model/rpc"

/** review 카테고리 선택 함수 */
export const clickCategory = (e:any ,item: string, reviewCategory:string[], setReviewCategory: any)=>{
    const btn = e.target
    const checkCategory = reviewCategory.includes(item)    
    if(btn.name === "category"){
      if(checkCategory){
        btn.classList.toggle('click-btn')
        const filter = reviewCategory.filter((fill)=>fill !== item)
        setReviewCategory(filter)
        return;
      }
      if(reviewCategory!.length < 3){
        btn.classList.toggle('click-btn')
        setReviewCategory([
          ...reviewCategory,
          item
        ])
      }
      else {
        alert("카테고리는 3개까지 선택 가능합니다.")
      }
    }  
}

/** review 태그 선택 함수 */
export const clickTag = (e:any ,item: string, reviewTag:string[], setReviewTag: any)=>{
    const btn = e.target
    const checkTag = reviewTag.includes(item)
    
    if(btn.name === "tag"){
      if(checkTag){
        btn.classList.toggle('click-btn')
        const filter = reviewTag.filter((fill)=>fill !== item)
        setReviewTag(filter)
        return;
      }
      if(reviewTag!.length <10){
        btn.classList.toggle('click-btn')
        setReviewTag([
          ...reviewTag,
          item
        ])
      }
      else {
        alert("카테고리는 10개까지 선택 가능합니다.")
      }
    }  
}

/**review 생성 요청 함수 */
export const createReview = async(reviewData: ReviewData, accessToken: string)=>{
  try{
    const response = await dbAxios.post('/users/review',reviewData,{
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    })
    if(response.data){
      window.location.href = "/review"
    }
  } catch(err) {
    console.error("리뷰 생성 요청 에러", err)
    alert("리뷰 생성 중 오류가 발생했습니다.")
  }

}


