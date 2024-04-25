import React from 'react'
import "./ReviewDetail.css"
import { useLocation, useParams } from 'react-router-dom'
import { AllReviewData } from '../../model/types'
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import ImageSlide from './ImageSlide';
import DOMPurify from 'dompurify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ReviewDetail = () => {
    const data:AllReviewData = useLocation().state
    const {_id} = useParams()
  return (
    <div className='review-detail-container'>
        <div className='review-detail-box'>
            <div className='review-detail-title'>
                <h4>{data.title}</h4>
                <span>{data.createBy.name}님의 리뷰 | {data.createdAt}</span>
            </div>
            <div className='review-detail-info'>
                <div className='review-detail-info-name'>
                    <span>가게명</span>
                    <span>주소</span>
                    <span>연락처</span>
                </div>
                <div className='review-detail-info-data'>
                    <span>{data.store.place_name}</span>
                    <span>{data.store.road_address_name}</span>
                    <span>{data.store.phone}</span>
                </div>
            </div>
            <div className='review-detail-category-tag'>
                <Stack direction="horizontal" gap={1}>
                    {data.category.map((item)=>(
                        <Badge bg="success">{item}</Badge>
                    ))}
                </Stack>
            </div>
            <div className='review-detail-category-tag'>
                <Stack direction="horizontal" gap={1}>
                    {data.tag.map((item)=>(
                        <Badge bg="warning">#{item}</Badge>
                    ))}
                </Stack>
            </div>
            <div className='review-detail-img-box'>
                <ImageSlide img={data.image}/>
            </div>
            <div 
                className='review-detail-content'
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(String(data.content))
                }}
            ></div>
            <div className='review-detail-comment-box'>
                <div className='review-detial-comment-form'>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>리뷰에 대한 댓글을 남겨보세요!</Form.Label>
                            <div style={{display: "flex"}}>
                                <Form.Control as="textarea" rows={3} />
                                <Button style={{width: "100px", marginLeft: "15px"}}variant="success">작성하기</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
                <div className='review-detial-comment'>
                    <h6>박지훈님</h6>
                    <span>좋은 글 감사합니다.</span>
                    <FontAwesomeIcon icon={faTrashCan} style={{position: "absolute", right: "10px", top: "5px", cursor: "pointer"}}/>
                </div>
                <div className='review-detial-comment'>
                    <h6>박지훈님</h6>
                    <span>좋은 글 감사합니다.</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ReviewDetail