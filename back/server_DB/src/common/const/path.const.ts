import { join } from "path"

// 서버 프로젝트 루트 폴더
export const PROJECT_ROOT_PATH = process.cwd()
// 외부에서 접근 가능한 폴더
export const PUBLIC_FOLDER_NAME ='public-img'
// 리뷰 이미지 폴더
export const REVIEWS_FOLDER_NAME ="reviews"

// 프로젝트폴더위치/public
export const PUBLIC_FOLDER_PATH = join(
    PROJECT_ROOT_PATH,
    PUBLIC_FOLDER_NAME
)

// 리뷰 이미지 저장할 폴더(전체경로)
export const REVIEWS_IMAGE_PATH = join(
    PUBLIC_FOLDER_PATH,
    REVIEWS_FOLDER_NAME
)

// 리뷰 이미지 요청 경로 /public/reviews
export const REQUEST_REVIEW_IMAGE_PATH = join(
    PUBLIC_FOLDER_NAME,
    REVIEWS_FOLDER_NAME
)