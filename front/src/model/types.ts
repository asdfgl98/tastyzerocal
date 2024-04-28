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
    likeList: string[]
}

/** 리뷰 데이터 Create 타입 */
export interface ReviewData {
    title: string
    store: MapInfoState
    category: string[]
    tag : string[]
    content: string
    image: string
  }

/** 리뷰 데이터 불러오기 타입 */
export interface AllReviewData extends ReviewData {
    _id: string
    title: string
    store: MapInfoState
    category: string[]
    tag : string[]
    content: string
    image: string
    createBy: {
        id: string,
        name: string
    }
    createdAt: string
    likeCount: string[],
    viewCount: number
}

export interface WriteComment {
    postId: string
    comment: string
}

export interface CommentData extends WriteComment{
    commentId: string
    userId: string
    userName: string
}