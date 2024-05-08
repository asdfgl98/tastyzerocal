import React, { useEffect, useMemo, useRef, useState } from 'react'
import "./CreateReview.css"
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FoodDetail from '../Main/FoodDetail';
import KakaoMap from '../Map/KakaoMap';
import ReactQuill from 'react-quill';
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';
import { clickCategory, clickTag, createReview } from '../../utils/review-Utils';
import { MapInfoState, ReviewData } from '../../model/types';
import { dbAxios } from '../../model/axios';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PacmanLoader from 'react-spinners/PacmanLoader'

interface OwnProp {
    showModal : boolean
    setShowModal(b: boolean) : void
}

interface imageList {
  imageName: string,
  s3Url : string
}


const foodType = ["한식", "양식", "일식", "중식", "분식","면류", "치킨" ,"고기","디저트", "튀김류", "햄버거","패스트 푸드",   "찜/탕/찌개"]
const foodTag = ["매운","맛집","혼밥","회식", "해장","달콤한", "시원한", "따듯한", "얼큰한", "새콤한", "고소한",  "기념일",  "상견례", "데이트", "소개팅", "부모님",  "술안주",  "이자카야","가족식사", "오마카세",  "분위기 좋은"]

const CreateReview:React.FC<OwnProp> = ({showModal, setShowModal}) => {
  const open = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js")
    const [clickDetailTap, setClickDetailTap] = useState<string>("")
    const storeData = useAppSelector((state)=>state.kakaomapData.reviewData)
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)
    const dispatch = useAppDispatch()
    const [reviewTitle, setReviewTitle] = useState<string>("")
    const [reviewCategory, setReviewCategory] = useState<string[]>([])
    const [reviewTag, setReviewTag] = useState<string[]>([])
    const [content, setContent] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string[]>([])
    const [imageList, setImageList] = useState<imageList[]>([])
    const directPlaceNameRef = useRef<HTMLInputElement>(null)
    const directRoadAddressNameRef = useRef<HTMLInputElement>(null)
    const directPhoneRef = useRef<HTMLInputElement>(null)
    const [directInputCheck, setDirectInputCheck] = useState<boolean>(false)
    const [directInputData, setDirectInputData] = useState<any>({
      place_name: "",
      road_address_name: "",
      phone: ""
    })
    const [isUpload, setIsUpload] = useState<boolean>(false)
    const quillRef = useRef<any>(null)   

    /** 이미지 서버로 저장 */
    const imageHandler = async()=>{
      //이미지 핸들 로직
      const input:any = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();

      input.onchange = async()=>{
        const file = input.files ? input.files[0] : null;
        if(!file) return;
        const formData = new FormData();        
        formData.append("image", file);
        /*에디터 정보를 가져온다.*/
        let quillObj = quillRef.current?.getEditor();
        /*에디터 커서 위치를 가져온다.*/
        const range = quillObj?.getSelection()!;
        try{
          const response = await dbAxios.post('/common/image', formData)
          // 이미지 스태틱 서빙 URL
          const imgUrl = `${process.env.REACT_APP_DB_SERVER}/public-img/reviews/${response.data}`
          // 에디터 커서에 서버에 저장된 이미지 삽입
          // quillObj.insertEmbed(range.index, "image", imgUrl)
          setImageUrl(prevList => [...prevList, response.data])
          setImageList(prevList => [...prevList, {
            imageName: file.name,
            s3Url: response.data
          }])
            
        } catch(err){
          console.error('이미지 업로드 에러 발생', err)
          alert('이미지가 업로드되지 않았습니다. 파일을 확인해주세요.')
        }
      }
    }

    const deleteImage = (s3Url : string)=>{
      const confirm = window.confirm("이미지를 삭제하시겠습니까?")
      if(!confirm){
        return;
      }
      const cpList = [...imageList]
      const newList = cpList.filter((item)=>item.s3Url !== s3Url)
      setImageList(newList)
      const cpUrl = [...imageUrl]
      const newUrl = cpUrl.filter((item)=> item !== s3Url)
      setImageUrl(newUrl)
    }

    const quillModule =useMemo(()=>{
      return {
        toolbar: {
          container: [
              ["image"],
              [{header: [1,2,3,4,5, false]}],
              ["bold", "underline"]
          ],
          handlers: {
            image: imageHandler
          }
        }
      }
    },[]) 

    const closeModal = ()=>{
      const confirm = window.confirm("리뷰 작성을 취소하시겠습니까? 작성중인 내용은 저장되지 않습니다.")
      if(confirm){
        setShowModal(false)
        setReviewTitle("")
        setReviewCategory([])
        setReviewTag([])
        setContent("")
        setImageUrl([])
        setImageList([])        
      }
    }

    /** 리뷰데이터 검증 및 리뷰생성 요청함수 실행 */
    const clickCreateReview = ()=>{
      const reviewData:ReviewData = {
        title: reviewTitle!,
        store: directInputCheck ?  directInputData : storeData,
        category: reviewCategory,
        tag : reviewTag,
        content: content!.replaceAll(/<img[^>]*>/g, ''),
        image: imageUrl
      }
      if(reviewData.title !== "" &&
        Object.keys(reviewData.store).length !==0 &&
        reviewData.content !== ""
      ){
        setIsUpload(true)
        createReview(reviewData, accessToken, setIsUpload)
      }
      else{
        alert("제목, 가게 선택, 내용은 필수항목입니다.")
      }
    }    
    
    const setDirectInput = ()=>{      
      directPlaceNameRef.current!.disabled = directInputCheck
      directRoadAddressNameRef.current!.disabled = directInputCheck
      directPhoneRef.current!.disabled = directInputCheck
      setDirectInputCheck(!directInputCheck)
    }

    const directInputStoreData = (e:any, type: string)=>{
      if(type === "name"){
        setDirectInputData({
          ...directInputData,
          place_name: e.target.value
        })
      }
      else if(type === "address"){
        setDirectInputData({
          ...directInputData,
          road_address_name: e.target.value
        })
      }
      else if(type === "phone"){
        setDirectInputData({
          ...directInputData,
          phone: e.target.value
        })
      }
    }

    /** DaumPostPopUp 오픈 함수 */
  const openPost = ()=>{
    open({
        onComplete: handleComplete
    })
    directRoadAddressNameRef.current!.focus()
    directPhoneRef.current!.focus()
  }

  /** 주소 선택시 실행 함수 */
  const handleComplete = (data:any) => {
    let fullAddress = data.address;
    let jibunAddress = data.jibunAddress;

    // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
    if (data.userSelectedType === 'R') {   // 도로명 주소
      directRoadAddressNameRef.current!.value = fullAddress
      setDirectInputData({
        ...directInputData,
        road_address_name: fullAddress
      })
    }
    else{
      directRoadAddressNameRef.current!.value = jibunAddress
      setDirectInputData({
        ...directInputData,
        road_address_name: jibunAddress
      })
    }
    // addressRef.current!.disabled = true
    directPhoneRef.current!.focus()
  };
    

  return (
    <div>
        <Modal
        show={showModal}
        onHide={() => closeModal()}
        dialogClassName="modal-90w"
        size="xl"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            리뷰 작성하기
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='review-create-container'>
            <div className='review-create-title'>
            <FloatingLabel
                controlId="floatingInput"
                label="제목을 입력해주세요."
                className="mb-3"
                onChange={(e:any)=>setReviewTitle(e.target.value)}
            >
                <Form.Control type="text" placeholder="나만 알고 있던 맛집" />
            </FloatingLabel>
            </div>
            <h4 style={{margin: "30px 10px 15px"}}>가게 선택</h4>
            {!directInputCheck && <div className='review-create-map'>
                <FoodDetail setClickDetailTap={setClickDetailTap}/>
                <KakaoMap clickDetailTap={clickDetailTap} containerCSS='review-map-container' mapCSS='review-mapStyle'/>
            </div>}
            <div className="direct-input">
            <Button onClick={()=>setDirectInput()} variant="success" style={{height: "58px"}}>직접 입력</Button>
              <FloatingLabel                 
                  controlId="floatingInput"
                  label="가게명"
                  className="mb-3"
                  onChange={(e:any)=>directInputStoreData(e, "name")}
              >
                  <Form.Control type="text" placeholder="가게명" ref={directPlaceNameRef} disabled/>
              </FloatingLabel>
              <FloatingLabel
                  controlId="floatingInput"
                  label="주소"
                  className="mb-3"
                  onClick={()=>openPost()}
              >
                  <Form.Control type="text" placeholder="주소" ref={directRoadAddressNameRef} disabled/>
              </FloatingLabel>
              <FloatingLabel
                  controlId="floatingInput"
                  label="가게 연락처(선택)"
                  className="mb-3"
                  onChange={(e:any)=>directInputStoreData(e, "phone")}
                  style={{overflow:"hidden"}}
                  >                 
                  <Form.Control type="text" placeholder="연락처" ref={directPhoneRef} disabled/>
              </FloatingLabel>

            </div>
            <div className='review-create-tag'>
                <h4>카테고리</h4>
                <span style={{margin: "5px"}}>최대 3개 선택 가능</span>
                <div className='food-type'>
                    {foodType.map((item, idx)=>(
                        <button 
                          key={idx} 
                          name="category" 
                          className='food-type-btn'
                          onClick={(e)=>{clickCategory(e, item,reviewCategory, setReviewCategory)}} 
                        >{item}</button>
                    ))}
                </div>
                <h4>태그</h4>
                <span style={{margin: "5px"}}>최대 10개 선택 가능</span>
                <div className='food-type'>
                    {foodTag.map((item, idx)=>(
                        <button 
                          key={idx} 
                          name="tag" 
                          className='food-type-btn'
                          onClick={(e)=>clickTag(e, item, reviewTag, setReviewTag)} 
                          >{item}</button>
                    ))}
                </div>
              </div>
              <div>
                <h4>내용</h4>
                <div className='review-create-textarea'>
                    <ReactQuill 
                    style={{width: "100%", height: "300px"}}
                    modules={quillModule}
                    onChange={setContent}
                    ref={quillRef}
                    
                    />
                </div>
              </div>
              <h4>첨부 파일</h4>
              <div className='review-create-img-list'>
                {imageList.map((item, idx)=>(
                  <div className='review-create-img' key={idx}>
                  <div>{item.imageName}</div>
                  <FontAwesomeIcon icon={faX} className='img-delete-btn' onClick={()=>deleteImage(item.s3Url)} style={{cursor: 'pointer'}}/>
                  </div>
                ))}
              </div>
              <div className='review-create-btn-box'>
                <Button variant="primary" onClick={()=>clickCreateReview()}>리뷰 작성하기</Button>
                <Button variant="primary" onClick={() => closeModal()}>취소</Button>
              </div>            
          </div>
        </Modal.Body>
      {isUpload ? 
        <div className='spinner-box'>
          <div className='spinner-div'>
            {/* <Spinners/> */}
            <PacmanLoader loading={isUpload} color={'#E0475B'} size={'50'} speedMultiplier={1}/>
          </div>
        </div> : null}
      </Modal>
    </div>
  )
}

export default CreateReview