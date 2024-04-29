import React, { useEffect, useRef, useState } from 'react'
import "./ReviewPage.css"
import ReviewCard from './ReviewCard'
import Button from 'react-bootstrap/Button';
import CreateReview from '../Modal/CreateReview';
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';
import { setMapInfo } from '../../Store/reducer/mapInfoSlice';
import { dbAxios } from '../../model/axios';
import { AllReviewData } from '../../model/types';



const ReviewPage = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)
    const dispatch = useAppDispatch()
    const [reviewData, setReviewData] = useState<AllReviewData[]>([])
    const sortNewRef = useRef<HTMLSpanElement>(null)
    const sortLikeRef = useRef<HTMLSpanElement>(null)
    const sortViewRef = useRef<HTMLSpanElement>(null)

    const getReivewData = async()=>{
        try{
            const response = await dbAxios.get('/reviews')
            setReviewData(response.data)
        } catch(err){
            alert("리뷰 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
            console.error("리뷰데이터 요청 에러 발생", err)
        }
    }

    const sortReiviwData = (type: string)=>{
        let newReviewData:AllReviewData[] = [...reviewData]
        if(type === "NEW"){
            newReviewData.sort((b, a)=> a.createdAt.localeCompare(b.createdAt))
            sortLikeRef.current!.className = ""
            sortViewRef.current!.className = ""
            sortNewRef.current!.className = "click-sort"
        }
        else if(type === "LIKE"){
            newReviewData.sort((b, a)=> a.likeCount.length - b.likeCount.length)
            sortViewRef.current!.className = ""
            sortNewRef.current!.className = ""
            sortLikeRef.current!.className = "click-sort"
        }
        else if(type === "VIEW"){
            newReviewData.sort((b, a)=> a.viewCount - b.viewCount)
            sortLikeRef.current!.className = ""
            sortNewRef.current!.className = ""
            sortViewRef.current!.className = "click-sort"
        }
        setReviewData(newReviewData)
    }

    useEffect(()=>{
        getReivewData()
        dispatch(setMapInfo([]))
    },[])

    const clickCreateReview = ()=>{
        if(accessToken === ""){
            alert("로그인이 필요한 서비스입니다.")
            return;
        }
        setShowModal(true)
    }

  return (
    <div className='review-page-container'>
        <div className='review-page-box'>
            <div className='review-page-header'>
                <h1>전체 게시판</h1>
            </div>
            <div className='review-page-tap'>
                <div className='review-page-create-btn'>
                    <Button variant="success" onClick={()=>clickCreateReview()}>리뷰 작성하기</Button>
                </div>
                <div className='review-page-filter'>
                    <span className="click-sort" ref={sortNewRef} onClick={()=>sortReiviwData("NEW")} style={{cursor: "pointer"}}>최신순</span>
                    <span ref={sortLikeRef} onClick={()=>sortReiviwData("LIKE")} style={{cursor: "pointer"}}>좋아요순</span>
                    <span ref={sortViewRef} onClick={()=>sortReiviwData("VIEW")} style={{cursor: "pointer"}}>조회순</span>
                </div>
            </div>
            <div className='review-page-card-box'>                
                {reviewData?.map((item, index)=>(
                    <ReviewCard key={index} data={item} reviewData={reviewData} setReviewData={setReviewData} isMyPage={false}/>
                ))}
            </div>
        </div>
        <CreateReview showModal={showModal} setShowModal={setShowModal}/>
    </div>
  )
}

export default ReviewPage