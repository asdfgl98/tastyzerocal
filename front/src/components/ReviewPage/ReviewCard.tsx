import React, { useEffect, useState } from 'react'
import Card from 'react-bootstrap/Card';
import "./Reviewcard.css"
import { AllReviewData } from '../../model/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons'
import { faEye, faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';
import { dbAxios } from '../../model/axios';
import { likeCount } from '../../utils/review-Utils';
import { useAppDispatch, useAppSelector } from '../../Store/hooks/hooks';

interface OwnProp {
  data: AllReviewData
  reviewData: AllReviewData[]
  setReviewData(data: any): void
  isMyPage: boolean
}

const ReviewCard:React.FC<OwnProp> = ({data, setReviewData,isMyPage}) => {
  const [checkLike, setCheckLike] = useState<boolean>(false)
  const navigater = useNavigate()
  const accessToken = useAppSelector((state)=>state.tokenData.accessToken)
  const userId = useAppSelector((state)=>state.userData.id)
  
  const clickReviewCard = async()=>{
    try{
      const viewCount= await dbAxios.put(`/reviews/view/${data._id}`)
    } catch(err){
      console.error("조회수 증가 요청 에러", err)
    }
    navigater(`/reviewDetail/${data._id}`, {state : data})
  }

  const clickLikeIcon = async(postId: string)=>{
    if(accessToken === ""){
      alert("로그인이 필요한 서비스입니다.")
      return;
    }
    const response = await likeCount(postId, accessToken, isMyPage)
    setReviewData(response)
  }

  useEffect(()=>{
    console.log(userId)
    if(data.likeCount.includes(userId)){
      setCheckLike(true)
    }
    else{
      setCheckLike(false)
    }
  }, [data])
  


  return (
    <div className='card-style' >
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" onClick={()=>clickReviewCard()} src={`https://${data.image[0]}`} style={{objectFit: "cover", cursor:"pointer"}} className="card-img"/>
        <Card.Body>        
            <Card.Title onClick={()=>clickReviewCard()} style={{cursor: "pointer"}}>{data.title}</Card.Title>
            <Card.Text>{data.store.place_name}</Card.Text>
            <div className='like-view-box'>
              <div className='like-box'>
                {checkLike ? 
                <FontAwesomeIcon onClick={()=>clickLikeIcon(data._id)} icon={faHeartSolid} size='xl' color='red'className='icon-like'/> :
                <FontAwesomeIcon onClick={()=>clickLikeIcon(data._id)} icon={faHeartRegular} size='xl' color='red'className='icon-like'/> 
                }
                <span className='count-span'>{data.likeCount.length}</span>
                <FontAwesomeIcon icon={faEye} />
                <span className='count-span'>{data.viewCount}</span>
              </div>
              <div className='card-info'>
                <span>{data.createBy.name} 님의 리뷰</span>
                <span>{data.createdAt.split(" ")[0]}</span>
              </div>
            </div>
        </Card.Body>
        </Card>
    </div>
  )
}

export default ReviewCard