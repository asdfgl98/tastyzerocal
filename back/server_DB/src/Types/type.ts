export interface JWT {
    accessToken: string,
    refreshToken: string
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

export interface CommentType {
    commentId: string
    postId: string
    userId: string
    userName: string
    comment: string
}

