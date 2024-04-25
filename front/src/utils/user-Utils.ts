import { resetToken } from "../Store/reducer/accessTokenSlice"
import { logOut } from "../Store/reducer/userDataSlice"
import { updateState } from "../components/MyPage/UserEdit"
import { dbAxios } from "../model/axios"
import { inputRegexs } from "../model/const"
import { UserState } from "../model/types"

/** 유저 정보 객체 공백 유무 확인 및 변동사항 확인 함수 */
const checkObject = (userData:any)=>{
    const updateUser:any = {...userData}
    for(const key in updateUser){
        if(updateUser[key] === ""){
            delete updateUser[key]
        }
    }

    if(Object.keys(updateUser).length > 0){
        return updateUser
    }

    return false
}

/** 유저 업데이트 요청 함수 */
export const userUpdate = async(userData: updateState, id: string, dispatch:any, accessToken: string)=>{
    const confirm = window.confirm("정보를 수정하시겠습니까?")
    if(!confirm){
        return false
    }
    const updateUser = checkObject(userData)
    if(updateUser){
        try{
            const response = await dbAxios.patch(`/users/${id}`,updateUser, {
                headers: {
                    "Authorization" : `Bearer ${accessToken}`
                }
            })
            if(response.data){
                alert("업데이트가 완료되었습니다.")
                window.location.href = "/mypage"
            }
    
        } catch(err){
            alert("정보 업데이트에 문제가 발생했습니다.")
            console.error("유저 정보 업데이트 에러", err)
        }        
    }
    else{
        alert("변경사항이 없습니다.")
    }
    
}


/** 회원정보 수정 유효성 검증 */
export const inputValidation = ({current}:any)=>{
    // 비밀번호 유효성 검증
    if(current.name === "password"){
      // 정규표현식
      if(current.value !== ""){
        const result = inputRegexs.pw.test(current.value)
        if(!result){
          alert("비밀번호는 8~16자의 영문 대/소문자, 숫자와 특수문자를 사용 해주세요.")
          return false
        }          
      }
    }
    // 이메일 유효성 검증
    if(current.name === "email"){
      // 정규표현식
      if(current.value !== ""){
        const result = inputRegexs.email.test(current.value)
        if(!result){
          alert("이메일을 다시한번 확인해주세요.")
          return false
        }          
      }
    }
    // 이름 유효성 검증
    if(current.name === "name"){
      // 정규표현식
      if(current.value !== ""){
        const result = inputRegexs.name.test(current.value)
        if(!result){
          alert("이름을 다시한번 확인해주세요.")
          return false
        }          
      }
    }

    return true
  }

  /** 회원 탈퇴 함수 */
  export const userDelete = async(userData:UserState, accessToken: string, dispatch: any)=>{
    console.log(userData)
    const confirm = window.confirm("탈퇴를 진행하시겠습니까?")
    if(!confirm){
        return false
    }
    try{

        const response = await dbAxios.delete(`/users/${userData.id}`, {
            headers:{
                "Authorization" : `Bearer ${accessToken}`
            }
        })
        if(response.data){
            alert("탈퇴가 완료되었습니다.")
            dispatch(resetToken())
            dispatch(logOut())
            window.location.href = "/"
        }
       
    } catch(err){
        alert("회원 탈퇴 도중 오류가 발생했습니다.")
        console.error(`${userData.loginType} 회원 탈퇴 요청 오류 발생`, err)
    }    
  }
