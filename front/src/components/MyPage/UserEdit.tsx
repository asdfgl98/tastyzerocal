import React, { useEffect, useRef, useState } from 'react'
import {  UserState } from '../../model/types'
import "./UserEdit.css"
import { useDaumPostcodePopup } from 'react-daum-postcode'
import { inputValidation, userDelete, userUpdate } from '../../utils/user-Utils'
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks'

interface OwnProp {
    userData: UserState
}

export interface updateState extends Pick<UserState, "name" | "email" | "address" | "addressDetail"> {
  password: string
}

const UserEdit:React.FC<OwnProp> = ({userData}) => {
    const open = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js")
    // 기존 유저 데이터
    const [userFormData, setUserFormData] = useState<UserState>(userData) 
    // 업데이트 유저 데이터
    const [updateData, setUpdateData]  =useState<updateState>({
      name: "", email: "", address:"",addressDetail:"",password:""
    })
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)
    const dispatch = useAppDispatch()
     // input Ref
    const nameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const emailRef = useRef<HTMLInputElement>(null)
    const addressRef = useRef<HTMLInputElement>(null)
    const addressDetailRef = useRef<HTMLInputElement>(null)

    /** DaumPostPopUp 오픈 함수 */
  const openPost = ()=>{
    open({
        onComplete: handleComplete
    })
    addressRef.current!.focus()
    addressDetailRef.current!.focus()
  }

  const onChangeData = (e: any)=>{
    const key = e.target.name
    setUpdateData({
      ...updateData,
      [key] : e.target.value
    })
  }

  /** 주소 선택시 실행 함수 */
  const handleComplete = (data:any) => {
    let fullAddress = data.address;
    let jibunAddress = data.jibunAddress;

    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') {   // 도로명 주소
      addressRef.current!.value = fullAddress
      setUpdateData({
        ...updateData,
        address: fullAddress
      })
    }
    else{
      addressRef.current!.value = jibunAddress
      setUpdateData({
        ...updateData,
        address: jibunAddress
      })
    }
    // addressRef.current!.disabled = true
    addressDetailRef.current!.focus()
  };

  /** 수정하기 버튼 클릭 함수 */
  const editClick = ()=>{
    const values = Object.values(editData)
    let checkValidation;
    for(let i=0; i < values.length; i++){
      checkValidation = inputValidation(values[i])
      if(!checkValidation){
        break
      }
    }
    if(checkValidation){
      userUpdate(updateData, userFormData.id, dispatch, accessToken)
    }
  }
  const editData = {
    "name": nameRef, 
    "password": passwordRef,
    "email": emailRef,
    "address": addressRef,
    "addressDetail": addressDetailRef
  }

  

  useEffect(()=>{
    if(userFormData){
      nameRef.current!.value = userFormData.name
      emailRef.current!.value = userFormData.email
      addressRef.current!.value = userFormData.address
      addressDetailRef.current!.value = userFormData.addressDetail
    }
  },[userFormData])

    
  return (
    <div className='user-edit-container'>
        <div className='user-edit-box'>
            <input type="text" placeholder={`${userData.loginType === "normal" ? "일반 로그인" : "소셜 로그인"}`} disabled/>
            <input type="text" placeholder={userData.id} disabled/>
            <input type="text" placeholder="이름을 입력해주세요." ref={nameRef} onChange={(e)=>onChangeData(e)} name="name"/>
            <input type="password" placeholder='변경 할 비밀번호를 입력해주세요.' ref={passwordRef} onChange={(e)=>onChangeData(e)} name="password"/>
            <input type="text" placeholder="이메일을 입력해주세요." ref={emailRef} onChange={(e)=>onChangeData(e)} name="email"/>
            <input type="text" placeholder="주소를 입력해주세요." ref={addressRef} onClick={()=>openPost()} onChange={(e)=>onChangeData(e)} name="address"/>
            <input type="text" placeholder='상세 주소를 입력해주세요.' ref={addressDetailRef} onChange={(e)=>onChangeData(e)} name="addressDetail"/>
            <button className='user-edit-button' onClick={editClick}>수정하기</button>
            <button className='user-delete-button' onClick={()=>userDelete(userFormData, accessToken, dispatch)}>회원 탈퇴</button>
        </div>
    </div>
  )
}

export default UserEdit