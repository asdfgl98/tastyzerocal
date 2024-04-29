import { dbAxios } from "../model/axios"
import { ReviewData, WriteComment } from "../model/types"

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

/** 리뷰 생성 요청 함수 */
export const createReview = async(reviewData: ReviewData, accessToken: string)=>{
  if(accessToken === ""){
    alert("로그인이 필요한 서비스 입니다.")
    return;
  }
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

/** 리뷰 삭제 요청 함수 */
export const deleteReview = async(postId: string, accessToken: string)=>{
  if(accessToken === ""){
    alert("로그인이 필요한 서비스 입니다.")
    return;
  }
  console.log(postId)
  try{
    const {data} = await dbAxios.delete('/reviews', {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      },
      params: {
        postId
      }
    })
    return data
  } catch(err){
    console.error('리뷰 삭제 요청 오류', err)
  }
}

/** 리뷰 게시물의 댓글 불러오기 함수 */
export const getComments = async(postId: string, setCommentData: any)=>{
  try{
    const {data} = await dbAxios.get(`/reviews/comment?postId=${postId}`)
    setCommentData(data)
  } catch(err){
    console.error("덧글 데이터 요청 오류", err)
  }
}

/** 리뷰 게시물에 댓글 쓰기 함수 */
export const writeCommentOnReview = async(commentData: WriteComment, accessToken: string)=>{
  if(accessToken === ""){
    alert("로그인이 필요한 서비스 입니다.")
    return false
  }
  if(commentData.comment === ""){
    alert("댓글을 입력해주세요.")
    return false
  }
  try{
    const {data} = await dbAxios.post('/reviews/comment', commentData, {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    })
    return data

  } catch(err){
    console.error('댓글 작성 요청 에러 발생', err)
  }
  
  
}

/** 리뷰 댓글 불러오기 */
export const getComment = async(_id: string)=>{
  try{
    const {data} = await dbAxios.get('/reviews/comment',{params:{_id}})
    return data
  } catch(err){
    console.error('리뷰 게시물에 대한 댓글 요청 에러 발생', err)
  }
  
}

/** 리뷰 댓글 삭제하기 */
export const deleteComment = async(commentId: string, postId: string, accessToken: string)=>{
  if(accessToken === ""){
    alert("로그인이 필요한 서비스 입니다.")
    return false
  }
  const confirm = window.confirm("댓글을 삭제하시겠습니까?")
  if(!confirm){
    return false
  }

  try{
    const {data} = await dbAxios.delete(`/reviews/comment`,{
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      },
      params: {
        commentId,
        postId
      }
    })
    return data

  } catch(err){
    console.error('댓글 삭제 요청 오류 발생', err)
  }
}

/** 리뷰 좋아요 클릭 */
export const likeCount = async(postId: string, accessToken: string, isMyPage: boolean)=>{
  try{
    const {data} = await dbAxios.put(`/reviews/like?postId=${postId}&isMyPage=${isMyPage}`,null, {
      headers: {
        "Authorization" : `Bearer ${accessToken}`
      }
    })
    return data

  } catch(err){
    console.error('좋아요 클릭 요청 오류 발생', err)
    return;
  }
}

