import React from 'react'
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';

interface OwnProp {
    img: string
}

const ImageSlide:React.FC<OwnProp> = ({img}) => {
  return (
    <Carousel>
    <Carousel.Item style={{display: "flex", justifyContent: "center", border: "none"}}>
        {/* <Image src={`https://${img}`} fluid style={{backgro}}/> */}
            <img src={`https://${img}`} style={{width:"500px", height:"500px", objectFit: "cover"}} alt="" />
    </Carousel.Item>  
  </Carousel>
  )
}

export default ImageSlide