import React, { useState } from 'react'
import Card from 'react-bootstrap/Card';
import "./Reviewcard.css"
import { AllReviewData } from '../../model/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid} from '@fortawesome/free-solid-svg-icons'
import { faEye, faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom';

interface OwnProp {
  data: AllReviewData
}

const ReviewCard:React.FC<OwnProp> = ({data}) => {
  const [checkLike, setCheckLike] = useState<boolean>(false)
  const navigater = useNavigate()
  
  const clickReviewCard = ()=>{
    navigater(`/reviewDetail/${data._id}`, {state : data})
  }


  return (
    <div className='card-style' >
        <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" onClick={clickReviewCard} src={`https://${data.image}`} style={{objectFit: "cover", cursor:"pointer"}} className="card-img"/>
        <Card.Body>        
            <Card.Title>{data.title}</Card.Title>
            <Card.Text>{data.store.place_name}</Card.Text>
            <div className='like-view-box'>
              <div className='like-box'>
                {checkLike ? 
                <FontAwesomeIcon icon={faHeartSolid} size='xl' color='red'className='icon-like'/> :
                <FontAwesomeIcon icon={faHeartRegular} size='xl' color='red'className='icon-like'/> 
                }
                <span className='count-span'>12</span>
                <FontAwesomeIcon icon={faEye} />
                <span className='count-span'>13</span>
              </div>
              <div className='card-info'>
                <span>박지훈</span>
                <span>2024-01-01</span>
              </div>
            </div>
        </Card.Body>
        </Card>
    </div>
  )
}

export default ReviewCard