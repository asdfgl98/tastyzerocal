import React, { useEffect, useRef, useState } from 'react'
import "./User.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faLocationDot, faUser } from '@fortawesome/free-solid-svg-icons'
import  { useDaumPostcodePopup } from 'react-daum-postcode'
import { UserData, inputRegexs } from '../../model/rpc'
import { dbAxios } from '../../model/axios'
import { useAppDispatch } from '../../Store/hooks/hooks'
import { setToken } from '../../Store/reducer/accessTokenSlice'

interface OwnProp {
  setUserPage(data: boolean): void
}




const Join:React.FC<OwnProp> = ({setUserPage}) => {
  const open = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js")
  const dispatch = useAppDispatch()
  // input Ref
  const idRef = useRef<HTMLInputElement>(null)
  const pwRef = useRef<HTMLInputElement>(null)
  const pwCheckRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const addressRef = useRef<HTMLInputElement>(null)
  const addressDetailRef = useRef<HTMLInputElement>(null)
  // error message Ref
  const idMessage = useRef<HTMLSpanElement>(null)
  const pwMessage = useRef<HTMLSpanElement>(null)
  const pw2Message = useRef<HTMLSpanElement>(null)
  const nameMessage = useRef<HTMLSpanElement>(null)
  const emailMessage = useRef<HTMLSpanElement>(null)
  const addressMessage = useRef<HTMLSpanElement>(null)
  
  const [userFormData, setUserFormData] = useState<UserData>({
    id: "",
    password: "",
    password2: "",
    name: "",
    email: "",
    address: "",
    addressDetail: "상세주소 없음"
  })

  const inputKey = {
    "id" : idRef,
    "password" : pwRef,
    "password2" :pwCheckRef,
    "name" : nameRef,
    "email" : emailRef,
  }

  const [joinReady, setJoinReady] = useState<boolean>(false)

  const btnRef = useRef<HTMLButtonElement>(null)

  const onChangeData = (e: any)=>{
    const key = e.target.name
    setUserFormData({
      ...userFormData,
      [key] : e.target.value
    })
  }

  /** DaumPostPopUp 오픈 함수 */
  const openPost = ()=>{
    open({
      onComplete: handleComplete
    })
    addressRef.current!.focus()
    addressDetailRef.current!.focus()

  }

  /** 회원가입 버튼 클릭 함수 */
  const joinRequest = async()=>{
    const values = Object.values(inputKey)
    values.forEach((item)=>{
      inputValidation(item)
    })
    const userData = {...userFormData}
    delete userData.password2
    if(userFormData.id !== "" &&
       userFormData.password !== "" &&
       userFormData.password === userFormData.password2 &&
       userFormData.name !== "" &&
       userFormData.email !== "" &&
       userFormData.address !== "" &&
       joinReady
    ){
      const {data} = await dbAxios.post('/auth/join', userData)
      console.log(data)
      if(data.status){
        dispatch(setToken(data.accessToken))
        alert("회원가입 완료")
        window.location.href='/'
      }
    }else{
      alert("필수 항목을 확인해주세요.")
    }
  }

  /** 회원가입 form 유효성 검증 함수 */
  const inputValidation = async({current}: any)=>{
    // 아이디 유효성 검증
    if(current.name === "id"){
      // 공백
      if(current.value === ""){
        idMessage.current!.classList.add("error-text")
        idMessage.current!.innerText = "아이디 : 필수 정보입니다."
        setJoinReady(false)
        return false
      } else {
        idMessage.current!.classList.remove("error-text")
      }
      // 정규표현식
      if(current.value !== ""){
        const result = inputRegexs.id.test(current.value)
        if(!result){
          idMessage.current!.classList.add("error-text")
          idMessage.current!.innerText = "아이디: 5~20자의 영문 소문자, 숫자와 특수기호(_),(-)만 사용 가능합니다."
          setJoinReady(false)
          return false
        } 
      }
      // ID중복 검사
      const idDuplicateCheck = await dbAxios.get(`/users/${current.value}`)
      console.log(idDuplicateCheck)
      if(idDuplicateCheck.data){
        setJoinReady(true)
        idMessage.current!.classList.remove("error-text")
      } else {
        idMessage.current!.classList.add("error-text")
        idMessage.current!.innerText = "아이디: 사용할 수 없는 아이디 입니다."
        setJoinReady(false)
        return false
      }
    }
    // 비밀번호 유효성 검증
    if(current.name === "password"){
      // 공백
      if(current.value === ""){
        pwMessage.current!.classList.add("error-text")
        pwMessage.current!.innerText = "비밀번호 : 필수 정보입니다."
        setJoinReady(false)
      } else {
        pwMessage.current!.classList.remove("error-text")
      }
      // 정규표현식
      if(current.value !== ""){
        const result = inputRegexs.pw.test(current.value)
        if(!result){
          pwMessage.current!.classList.add("error-text")
          pwMessage.current!.innerText = "비밀번호: 8~16자의 영문 대/소문자, 숫자와 특수문자를 사용 해주세요."
          setJoinReady(false)
          return false
        }          
      }
      setJoinReady(true)      
    }
    // 비밀번호 확인 유효성 검증
    if(current.name === "password2"){
      const pw = pwRef.current!.value
      // 공백
      if(current.value === "" || current.value !== pw){
        pw2Message.current!.classList.add("error-text")
        pw2Message.current!.innerText = "비밀번호가 일치하지않습니다."
        setJoinReady(false)
        return false
      } else {
        pw2Message.current!.classList.remove("error-text")
        setJoinReady(true)
      }
      
    }
    // 이름 유효성 검증
    if(current.name === "name"){
      // 공백
      if(current.value === ""){
        nameMessage.current!.classList.add("error-text")
        nameMessage.current!.innerText = "이름: 필수 정보입니다."
        setJoinReady(false)
      } else {
        nameMessage.current!.classList.remove("error-text")
      }
      // 정규표현식
      if(current.value !== ""){
        const result = inputRegexs.name.test(current.value)
        if(!result){
          nameMessage.current!.classList.add("error-text")
          nameMessage.current!.innerText = "이름: 정확하게 입력해주세요."
          setJoinReady(false)
          return false
        } 
      }
      setJoinReady(true)
    }
    // 이메일 유효성 검증
    if(current.name === "email"){
      // 공백
      if(current.value === ""){
        emailMessage.current!.classList.add("error-text")
        emailMessage.current!.innerText = "이메일: 필수 정보입니다."
        setJoinReady(false)
      } else {
        emailMessage.current!.classList.remove("error-text")
      }
      // 정규표현식
      if(current.value !== ""){
        const result = inputRegexs.email.test(current.value)
        if(!result){
          emailMessage.current!.classList.add("error-text")
          emailMessage.current!.innerText = "이메일: 정확하게 입력해주세요."
          setJoinReady(false)
          return false
        } 
      }
      setJoinReady(true)
    }
  }




  /** 주소 선택시 실행 함수 */
  const handleComplete = (data:any) => {
    let fullAddress = data.address;
    let jibunAddress = data.jibunAddress;

    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') {   // 도로명 주소
      addressRef.current!.value = fullAddress
      setUserFormData({
        ...userFormData,
        address: fullAddress
      })
    }
    else{
      addressRef.current!.value = jibunAddress
      setUserFormData({
        ...userFormData,
        address: jibunAddress
      })
    }
    addressRef.current!.disabled = true
    addressDetailRef.current!.focus()
       
  };

  return (
        <div className='join-container'>
          <div className='join-box'>
          <h3 style={{margin : "2rem 0 2rem 0"}}>회원가입</h3>
          <div className='join-form'>
            <div className="form-section-up">
              <div className="form-id">
                <div className="form-icon-div">
                  <FontAwesomeIcon icon={faUser}/>
                </div>
                <div className="form-input-div">
                  <input type='text' placeholder='아이디' ref={idRef} name="id" onBlur={()=>inputValidation(idRef)} onChange={(e)=>onChangeData(e)}></input>
                </div>
              </div>
              <div className="form-pw">
              <div className="form-icon-div">
                  <FontAwesomeIcon icon={faKey}/>
                </div>
                <div className="form-input-div">
                  <input type='password' placeholder='비밀번호' ref={pwRef}  name="password" onBlur={()=>inputValidation(pwRef)} onChange={(e)=>onChangeData(e)}></input>
                </div>
              </div>
              <div className="form-pw2">
              <div className="form-icon-div">
                  <FontAwesomeIcon icon={faKey}/>
                </div>
                <div className="form-input-div">
                  <input type='password' placeholder='비밀번호 확인' ref={pwCheckRef}  name="password2" onBlur={()=>inputValidation(pwCheckRef)} onChange={(e)=>onChangeData(e)}></input>
                </div>
              </div>
            </div>
            <div className="error-text-div">
              <span className="error-text-id" ref={idMessage}>아이디 : 필수 정보입니다.</span>
              <span className="error-text-pw" ref={pwMessage}>비밀번호 : 필수 정보입니다.</span>
              <span className="error-text-pw2" ref={pw2Message}>비밀번호가 일치하지않습니다.</span>
            </div>

            <div className="form-section-down">
              <div className="form-name">
                <div className="form-icon-div">
                  <FontAwesomeIcon icon={faUser}/>
                </div>
                <div className="form-input-div">
                  <input type='text' placeholder='이름' ref={nameRef}  name="name" onBlur={()=>inputValidation(nameRef)} onChange={(e)=>onChangeData(e)}></input>
                </div>
              </div>
              <div className="form-email">
              <div className="form-icon-div">
                  <FontAwesomeIcon icon={faEnvelope}/>
                </div>
                <div className="form-input-div">
                  <input type='text' placeholder='이메일' ref={emailRef}  name="email" onBlur={()=>inputValidation(emailRef)} onChange={(e)=>onChangeData(e)}></input>
                </div>
              </div>
              <div className="form-address" onClick={()=>openPost()}>
              <div className="form-icon-div">
                  <FontAwesomeIcon icon={faLocationDot}/>
                </div>
                <div className="form-input-div">
                  <input type='text'  placeholder='주소' ref={addressRef}  style={{backgroundColor:"white"}}  name="address" onBlur={()=>inputValidation(addressRef)}></input>
                </div>
              </div>
              <div className="form-address-detail">
              <div className="form-icon-div">
                  <FontAwesomeIcon icon={faLocationDot}/>
                </div>
                <div className="form-input-div">
                  <input type='text' placeholder='상세 주소 [선택]' name="addressDetail" ref={addressDetailRef} onChange={(e)=>onChangeData(e)}></input>
                </div>
              </div>
            </div>
            <div className="error-text-div">
              <span className="error-text-name" ref={nameMessage}>이름 : 필수 정보입니다.</span>
              <span className="error-text-email" ref={emailMessage}>이메일 : 필수 정보입니다.</span>
              <span className="error-text-address" ref={addressMessage}>주소 : 필수 정보입니다.</span>
            </div>
            <div className="button-box">
              <button ref={btnRef} onClick={()=>joinRequest()}>가입 하기</button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Join