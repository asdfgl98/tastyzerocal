import React, { useEffect, useState } from 'react'
import "./ReviewDetail.css"
import { useLocation, useParams } from 'react-router-dom'
import { AllReviewData, CommentData, WriteComment } from '../../model/types'
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import ImageSlide from './ImageSlide';
import DOMPurify from 'dompurify';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../Store/hooks/hooks';
import { deleteComment, getComments, writeCommentOnReview } from '../../utils/review-Utils';


const ReviewDetail = () => {
    const data:AllReviewData = useLocation().state
    const {_id} = useParams()
    const userId = useAppSelector((state)=>state.userData.id)
    const accessToken = useAppSelector((state)=>state.tokenData.accessToken)
    const [writeComment, setWriteComment] = useState<WriteComment>({
        postId: _id!,
        comment: ""
    })
    const [commentData, setCommentData] = useState<CommentData[]>()

    useEffect(()=>{
        if(_id){
            getComments(_id, setCommentData)
        }
    },[_id])

    const changeComment = (e: any)=>{
        setWriteComment({
            ...writeComment,
            comment: e.target.value
        })
    }

    const clickWrite = async()=>{
        const comment = await writeCommentOnReview(writeComment, accessToken)
        if(comment){
            setCommentData(comment)
        }
    }

    const clickDeleteComment = async(commentId: string)=>{
        const result = await deleteComment(commentId, _id!, accessToken)
        if(result){
            setCommentData(result)
        }
    }

  return (
    <div className='review-detail-container'>
        <div className='review-detail-box'>
            <div className='review-detail-title'>
                <h4>{data.title}</h4>
                <span>{data.createBy.name}님의 리뷰 | {data.createdAt} 작성</span>
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
                    {data.category.map((item, idx)=>(
                        <Badge bg="success" key={idx}>{item}</Badge>
                    ))}
                </Stack>
            </div>
            <div className='review-detail-category-tag'>
                <Stack direction="horizontal" gap={1}>
                    {data.tag.map((item, idx)=>(
                        <Badge bg="warning" key={idx}>#{item}</Badge>
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
                                <Form.Control as="textarea" rows={3} onChange={(e)=>changeComment(e)}/>
                                <Button onClick={()=>clickWrite()} style={{width: "100px", marginLeft: "15px"}}variant="success">작성하기</Button>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
                {commentData?.map((item)=>(
                    <div className='review-detial-comment' key={item.commentId}>                    
                         <h6>{item.userName}님</h6>
                         <span>{item.comment}</span>
                         {userId === item.userId ? <FontAwesomeIcon onClick={()=>clickDeleteComment(item.commentId)} icon={faTrashCan} style={{position: "absolute", right: "10px", top: "5px", cursor: "pointer"}}/> : null}
                    </div>
                ))}
               
            </div>
        </div>
    </div>
  )
}

export default ReviewDetail