import React, { useEffect, useMemo, useRef, useState } from 'react'
import "./reviewModal.css"
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import FoodDetail from '../Main/FoodDetail';
import KakaoMap from '../Map/KakaoMap';
import ReactQuill from 'react-quill';
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';
import { clickCategory, clickTag, createReview } from '../../utils/reviewModal-Utils';
import { MapInfoState, ReviewData } from '../../model/types';
import { dbAxios } from '../../model/axios';

interface OwnProp {
    showModal : boolean
    setShowModal(b: boolean) : void
}



const foodType = ["한식", "양식", "일식", "중식", "분식", "디저트", "패스트 푸드", "면류", "튀김류","고기", "찜/탕/찌개", "햄버거", "치킨"]
const foodTag = ["매운", "달콤한", "시원한", "따듯한", "얼큰한", "새콤한", "고소한", "맛집", "기념일", "오마카세", "상견례", "데이트", "소개팅", "가족식사", "부모님", "회식", "술안주", "해장", "이자카야", "혼밥", "분위기 좋은"]

const CreateReview:React.FC<OwnProp> = ({showModal, setShowModal}) => {
    const [clickDetailTap, setClickDetailTap] = useState<string>("")
    const storeData = useAppSelector((state)=>state.kakaomapData.reviewData)
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)
    const dispatch = useAppDispatch()
    const [reviewTitle, setReviewTitle] = useState<string>("")
    const [reviewCategory, setReviewCategory] = useState<string[]>([])
    const [reviewTag, setReviewTag] = useState<string[]>([])
    const [content, setContent] = useState<string>("")
    const [imageUrl, setImageUrl] = useState<string>("")
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
          quillObj.insertEmbed(range.index, "image", imgUrl)
          setImageUrl(response.data)

        } catch(err){
          console.error('이미지 업로드 에러 발생', err)
        }
      }
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
      }
    }

    /** 리뷰데이터 검증 및 리뷰생성 요청함수 실행 */
    const clickCreateReview = ()=>{
      const reviewData:ReviewData = {
        title: reviewTitle!,
        store: storeData,
        category: reviewCategory,
        tag : reviewTag,
        content: content!.replaceAll(/<img[^>]*>/g, ''),
        image: imageUrl
      }
      if(reviewData.title !== "" &&
        Object.keys(reviewData.store).length !==0 &&
        reviewData.content !== ""
      ){
        createReview(reviewData, accessToken)
      }
      else{
        alert("제목, 가게 선택, 내용은 필수항목입니다.")
      }
    }
    
    

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
            <div className='review-create-map'>
                <FoodDetail setClickDetailTap={setClickDetailTap}/>
                <KakaoMap clickDetailTap={clickDetailTap} containerCSS='review-map-container' mapCSS='review-mapStyle'/>
            </div>
            <div className='review-create-tag'>
                <h4>카테고리</h4>
                <span style={{margin: "5px"}}>최대 3개 선택 가능</span>
                <div className='food-type'>
                    {foodType.map((item, idx)=>(
                        <Button key={idx} variant="warning" name="category" onClick={(e)=>clickCategory(e, item,reviewCategory, setReviewCategory)} className='food-type-btn'>{item}</Button>
                    ))}
                </div>
                <h4>태그</h4>
                <span style={{margin: "5px"}}>최대 10개 선택 가능</span>
                <div className='food-type'>
                    {foodTag.map((item, idx)=>(
                        <Button key={idx} variant="warning" name="tag" onClick={(e)=>clickTag(e, item, reviewTag, setReviewTag)} className='food-type-btn'>{item}</Button>
                    ))}
                </div>
                <h4>내용</h4>
                <div className='review-create-textarea'>
                    <ReactQuill 
                    style={{width: "100%", height: "300px"}}
                    modules={quillModule}
                    onChange={setContent}
                    ref={quillRef}
                    
                    />
                </div>
                <div className='review-create-btn-box'>
                <Button variant="primary" onClick={()=>clickCreateReview()}>리뷰 작성하기</Button>
                <Button variant="primary" onClick={() => closeModal()}>취소</Button>
                </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CreateReview