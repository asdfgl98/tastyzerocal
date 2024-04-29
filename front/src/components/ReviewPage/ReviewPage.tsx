import React, { useEffect, useState } from 'react'
import "./ReviewPage.css"
import ReviewCard from './ReviewCard'
import Button from 'react-bootstrap/Button';
import CreateReview from '../Modal/CreateReview';
import { useAppDispatch } from '../../Store/hooks/hooks';
import { setMapInfo } from '../../Store/reducer/mapInfoSlice';
import { dbAxios } from '../../model/axios';
import { AllReviewData } from '../../model/types';



const ReviewPage = () => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const dispatch = useAppDispatch()
    const [reviewData, setReviewData] = useState<AllReviewData[]>([])

    const getReivewData = async()=>{
        try{
            const response = await dbAxios.get('/reviews')
            setReviewData(response.data)
        } catch(err){
            alert("리뷰 작성 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
            console.error("리뷰데이터 요청 에러 발생", err)
        }
    }

    useEffect(()=>{
        getReivewData()
        dispatch(setMapInfo([]))
    },[])

  return (
    <div className='review-page-container'>
        <div className='review-page-box'>
            <div className='review-page-header'>
                <h1>전체 게시판</h1>
            </div>
            <div className='review-page-tap'>
                <div className='review-page-create-btn'>
                    <Button variant="success" onClick={()=>setShowModal(true)}>리뷰 작성하기</Button>
                </div>
                <div className='review-page-filter'>
                    <span>최신순</span>
                    <span>좋아요순</span>
                    <span>조회순</span>
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