import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';

interface OwnProp {
    img: string[]
}

const ImageSlide:React.FC<OwnProp> = ({img}) => {
  return (
    <Carousel data-bs-theme="dark">
      {img.map((item, idx)=>(
        <Carousel.Item style={{ border: "none"}} interval={100000000} key={idx}>
            <div style={{display: "flex", justifyContent: "center"}}>
            <img src={`https://${item}`} style={{width:"500px", height:"500px", objectFit: "cover"}} alt="" />
            </div>
        </Carousel.Item>  
      ))}  
  </Carousel>
  )
}

export default ImageSlide