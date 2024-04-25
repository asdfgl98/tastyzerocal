import { changeRegionName, setMapInfo, storeDataSaveForReview } from "../Store/reducer/mapInfoSlice"
import { kakaoAxios } from "../model/axios"

/** kakaomap 카테고리(음식점)별 데이터 요청 함수*/
export const kakaoCategorySearch = async(latLng: {lng: number, lat: number}, dispatch: any): Promise<void>=>{
    try{
      const response = await kakaoAxios.get(`/kakaomaps/categorysearch?x=${latLng.lng}&y=${latLng.lat}`)
      dispatch(setMapInfo(response.data.documents))
      dispatch(changeRegionName(response.data.documents[0].address_name.split(" ")[0]))
  
    } catch (err){
      console.error('kakao category 데이터 요청 오류(front)', err)
    }
  }
  
  // customOverlays 담기 위한 배열
  let customOverlays: any = []
  /** CustomOverlay(인포윈도우) 생성 후 지도에 표시 함수 */
  export const displayInfowindow= (place: any, map: any, i: number , infowindowRef:any, dispatch: any): void=> { 
    const content = `
      <div class="infowindow-container" data-name="${place.place_name}">
          <span class="infowindow-name">${place.place_name}</span><br/>
          <span class="infowindow-type">${place.category_name.split(' ')[place.category_name.split(' ').length-1]}</span>  
      </div>
      `
    // 좌표 설정
    const position = new window.kakao.maps.LatLng(place.y, place.x)
    // infowindow 생성
    const infowindow = new window.kakao.maps.CustomOverlay({
      map:map,
      position: position,
      content: content,
      yAnchor: 1.2,      
    }); 
    customOverlays.push(infowindow)            
  
    // 생성한 infowindow에 click 이벤트
    const info = document.getElementsByClassName('infowindow-container')[i]
  
    // useRef에 인포윈도우 요소 추가
    if (info) {
      infowindowRef.current[i] = info;
    }
  
    info?.addEventListener("click",()=>{
      const infowindows = document.querySelectorAll('.infowindow-container');
      // 모든 인포윈도우의 active 클래스 제거
      infowindows.forEach((infowindow) => {
          infowindow.classList.remove('active');
      })
      // 모든 인포윈도우 zIndex 0으로 변경
      customOverlays.forEach((customOverlay: any)=>{
        customOverlay.setZIndex(0)
      })
      // 클릭한 인포윈도우에 class 추가
      info.classList.add('active')
      // 클릭한 인포윈도우 zIndex 1로 변경
      infowindow.setZIndex(1)
      // 클릭한 인포윈도우 중심으로 좌표 변경
      map.panTo(position)
      
      // 클릭한 인포윈도우와 동일한 detailTap로 스크롤 및 클래스 부여
      const detailTapDivs = document.querySelectorAll('.food-detail-card')
      detailTapDivs.forEach((detailTapDiv)=>{
        // 모든 detailTapDiv의 클래스 제거
        detailTapDiv.classList.remove('active-box');
        const div = detailTapDiv.getAttribute('data-name')
        if(div === place.place_name){
          detailTapDiv.classList.add('active-box')
          detailTapDiv.scrollIntoView({ behavior: 'smooth',  block: 'nearest', inline: 'center'});
        }
      })
      dispatch(storeDataSaveForReview(place))
    })  
  }
  