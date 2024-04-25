 // 정규식 모음 객체
 export const inputRegexs = {
  // 아이디 : 문자로 시작하여, 영문자, 숫자, 하이픈(-), 언더바(_)를 사용하여 5~20자 이내
  id: /^[a-zA-Z][a-zA-Z0-9_-]{4,19}$/,
  // 비밀번호 : 8~16자 이상, 최소한 하나의 대문자 또는 특수문자,하나의 소문자, 하나의 숫자, 포함, 공백 허용하지 않음
  pw: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z@#$%^&+=!])(?!.*\s).{8,16}$/,
  // 이름 : 영어 대/소문자, 숫자, 한글 자모음 조합, 2~10자 이내
  name: /^[가-힣]{2,10}$/,
  email: /^[a-zA-Z0-9]*@[a-z]*\.[a-z]{2,3}/
};

/* 위도 경도 타입 */
export interface LatLng {
    lat: number;
    lng: number;
}

/* 카카오맵 음식점 API 데이터 타입 */
export interface MapInfoState {
    address_name: string
    category_group_code: string
    category_group_name: string
    category_name: string
    distance: string
    id: string
    phone: string
    place_name: string
    place_url: string
    road_address_name: string
    x: string
    y: string
}

/** 지역 이름 데이터 타입 */
export interface RegionState {
    koreaRegion: string
    city: string[]
    _id: string
}

/** 회원가입 유저 데이터 타입 */
export interface UserData {
    id: string
    password: string
    password2: string | undefined
    name: string
    email: string
    address: string
    addressDetail: string | null

}

/** 즐겨찾기 데이터 타입 */
export interface FavoriteList {
    id: string
    place_name: string
    category_name: string
    road_address_name: string
    phone: string | null
    place_url: string
}

/** 회원 정보 타입 */
export interface UserState {
    id: string
    name : string
    email: string
    address: string
    addressDetail : string
    loginType: string
    favoriteList: FavoriteList[]
}

/** 리뷰 데이터 타입 */
export interface ReviewData {
    title: string
    store: MapInfoState
    category: string[]
    tag : string[]
    content: string
    image: string
  }