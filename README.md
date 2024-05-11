 # ✅ 프로젝트 소개

맛있으면 0칼로리는 맛집 정보 제공 웹 서비스 입니다.

사용자의 위치 / 지역 검색 / 식당명 기반으로 Kakao API 에서 제공하는 음식점 정보 Kakao Map 을 통해 보여줍니다. 또한, 리뷰 게시판을 통해 사용자들 간의 맛집 정보 공유가 가능합니다.


배포 URL : https://tastyzerocal.store/

## 프로젝트 아키텍처
![image](https://github.com/asdfgl98/tastyzerocal/assets/83624652/23af61ed-0848-41d4-8ae6-46bd05dafb85)


</br>

# 🧑‍💼 담당 역할
## **개인 프로젝트**
- React + Typescript 로 프론트영역 구성
- NestJS로 API 요청을 담당하는 서버와 DataBase 요청을 담당하는 서버 구축
- MongoDB Atals를 활용하여 클라우드 DataBase 서버 구축
- AWS EC2에 Docker를 활용하여 Container 배포
- HTTPS 환경 구성
- Jenkins로 CI/CD 환경 구축 / Discord 플러그인 활용 jenkins 결과 전송
- 리뷰 업로드 속도 약 67.5% 개선(2초 -> 0.65초)
  
</br>

# 🛠️ 사용 기술

- **React**  :  React에서 제공하는 Hooks와 컴포넌트 재사용의 장점을 살려 보다 쉽게 프론트엔드를 구성하기 위해 사용했습니다.
- **TypeScript** : 컴파일 과정에서 타입 오류를 발견하여 프로젝트의 안정성을 높이기 위해 사용하였습니다.
- **NestJS** : 이전 프로젝트에서 사용한 ExpressJS에서는 제공하지 않았던 서버 아키텍처에 대해 이해하고 유지보수의 장점을 가져가기 위해 사용했습니다.
- **JWT** :  사용자 인증이 필요한 모든 요청에 대해 JWT를 활용했습니다.
- **MongoDB Atlas** : 자유로운 스키마를 활용하여 관계형 데이터베이스에서 겪었던 문제를 해소하고, 유연한 확장성을 위해 NoSQL인 MongoDB를 사용하였고, 자동으로 DB Server를 배포하고 관리 해주는 MongoDB Atlas를 사용하여 개발에 집중했습니다.
- **Multer** : 리뷰 작성 시 포함될 image를 선 업로드하기 위해 사용하였습니다.
- **CloudFront와 S3** : 페이지가 로딩될 때마다 S3에 저장되어 있는 데이터를 불러올 때 너무 많은 리소스를 사용하게 되어 CloudFront를 통해 캐싱 되어 있는 데이터를 불러와 S3 리소스 비용을 줄이기 위해 사용했습니다.
- **Docker** : 프로젝트를 이미지로 빌드 후, 컨테이너화 하여 다양한 PC환경 및 배포 환경에서 동일하게 작동하도록 하기 위해 사용했습니다.
- **Jenkins** : 소스 코드 수정 시 배포 환경에 빠르게 적용하기 위한 CI/CD 환경을 구성하여 배포 자동화를 위해 사용했습니다.
  
</br>

# 🖥️ 구현 기능

### 메인페이지
- 카카오 API를 통해 지도와 음식점 정보를 얻어와 사용자에게 제공
  - 데이터 베이스에서 한국 지역별 데이터를 불러와 사용자가 손쉽게 검색할 수 있는 모달 구현
  - 카카오API로 불러온 음식점 데이터를 인포윈도우를 통해 위치 표시
  - 음식점 상세 정보 제공을 위한 Detail Tap 구현
  - 음식점 즐겨찾기 기능 구현     

### 회원가입 및 로그인

- 일반 회원가입과, 소셜 로그인 두 가지를 활용한 로그인 기능
    - 일반 회원가입 폼 작성 시, 정규 표현식 활용 유효성 검증
    - 서버측에서 DTO를 활용한 2차 검증 후, Mongoose를 활용해 MongoDB에 저장
- JWT를 사용한 사용자 인증
    - 회원가입, 로그인 시 accessToken과 refreshToken 발급
    - 클라이언트에서 서버로 요청 시 header에 accessToken을 담아 전송
    - 서버에서 NestJS의 Guard를 사용해 토큰 유효성 검증 후 Controller로 전달

### 리뷰 페이지

- 리뷰 작성 모달
    - 리뷰 작성 시, 가게를 선택할 수 있도록 메인페이지에서 사용한 지도 컴포넌트 재사용
    - 리뷰 작성 중 multer 라이브러리와  AWS S3를 활용한 이미지 업로드
- 리뷰 게시판
    - 작성된 리뷰 데이터를 불러와 map 함수로 리뷰 Card 생성
    - 각 리뷰별 DB에 저장되어있는 데이터를 기반으로 정렬 기능(최신순, 좋아요순, 조회순)
    - 리뷰 게시물 좋아요 기능 구현
- 리뷰 상세보기
    - 댓글 기능 구현

### 마이 페이지

- 회원정보수정
    - 회원정보 수정 및 탈퇴 시 accessToken 검증을 통해 업데이트 및 삭제
- 즐겨찾기, 리뷰, 리뷰 좋아요 목록
    - MongoDB에 데이터를 기반으로 사용자가 즐겨찾기, 작성한 리뷰, 좋아요 목록을

### 배포

- AWS EC2 인스턴스에 배포
- 배포 시 Docker로 각 애플리케이션(3개) 컨테이너화
    - 클라이언트(React)
    - API 서버(NestJS)
    - DB 서버(NestJS)
- docker-compose를 활용하여 다중 컨테이너 관리
- Jenkins를 활용하여 CI/CD 배포 자동화 환경 구성
  
</br>

# ⚠️ 성능 개선 및 트러블 슈팅


## 리뷰 업로드(이미지) 속도 개선 약 67.5%

### 개선 전
기존 방식은 리뷰 작성 중 이미지를 첨부하고 리뷰 작성하기 버튼을 클릭했을 때,

 **한번에 리뷰 데이터와 이미지를 서버로 전송**하고 S3에 업로드 및 DB에 저장하는 방식으로 

**3MB의 이미지를 총 3장** 업로드 할 때 **약 2초의 시간이 발생**하였습니다.
<div style="display: flex; width: 100%;">
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/c52dcfac-70a0-4f02-b8aa-8158a7c8d6b7" style="width: 55%; height: 100%;"/>
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/e8269e02-8c68-4d50-abb6-fbc1353029f3" style="width: 35%; height: 100%;"/>
</div>


### 개선 방향 및 방법

이미지 선 업로드 방식을 통해 이미지를 첨부함과 동시에 이미지를 서버로 전송하여 서버 내에서 보관하고 있다가 리뷰 작성하기 버튼을 클릭했을 때, 리뷰 데이터만 전송하고 S3 업로드 부분의 비동기 방식을 효율적인 방향으로 수정하였습니다.

<br/>

### 첫 번째 개선 후

이미지 선 업로드 방식을 적용한 후, **약 1.35초의 시간이 발생**하여 기존 대비 **32.5%** 성능이 개선되었습니다. 

여기서 만족하지 않고 개선점을 찾기 위해 리뷰 생성 Controller의 코드를 읽어보며 두 번째 개선방안을 찾았습니다.
<div style="display: flex; width: 100%;">
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/8b8f9f23-2be4-48bf-bcdc-859f1abe2fc9" style="width: 55%; height: 100%;"/>
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/1b414b0a-7291-45d0-b7fc-e435caaa3da0" style="width: 35%; height: 100%;"/>

</div>


### 두 번째 개선 후

S3 업로드 로직의 비동기 처리 코드를 수정하여 최종적으로 **동일한 3MB의 이미지를 총 3장** 업로드 할 때  **약 0.65초의 시간이 발생**하여 리뷰 업로드 속도가 **약 67.5%** 개선되었습니다.

업로드 로직 변경 전에는 모든 이미지에 대한 업로드를 await하여 업로드가 완료 되면 return을 하였지만, 

리뷰 카드에 썸네일로 사용되는 첫 번째 이미지가 업로드 될 때까지만 await 하도록 수정하여 조금 더 빠르게 return을 할 수 있도록 수정하였습니다.

<details>
<summary>변경 코드</summary>
 
 ```
// 변경 전
 async imageUploadToS3(fileName: string[]){
        let imageList = []
        for(let i=0; i< fileName.length; i++){
            
            const filePath = path.join(REVIEWS_IMAGE_PATH, fileName[i])
            const imageFile =  fs.readFileSync(filePath)
            const imageType = fileName[i].split(".")[1]

            const command = new PutObjectCommand({
                Bucket: this.configService.get("AWS_BUCKET_NAME"),
                Key: fileName[i],
                Body: imageFile,
                ContentType: `image/${imageType}`
            })

            try{
                await this.s3.send(command) // 모든 업로드에 대해 await
                imageList.push(`${this.configService.get("AWS_CLOUD_FRONT_DN")}/${fileName[i]}`)

            } catch(err){
                console.log('imageUploadToS3 : s3 업로드 에러', err)
                throw new BadRequestException('imageUploadToS3 : s3 업로드 에러')
            }
        }

        return imageList
    }

 ```

```
// 변경 후

async imageUploadToS3(fileName: string[]){
        let imageList = []
        for(let i=0; i< fileName.length; i++){
            
            const filePath = path.join(REVIEWS_IMAGE_PATH, fileName[i])
            const imageFile =  fs.readFileSync(filePath)
            const imageType = fileName[i].split(".")[1]

            const command = new PutObjectCommand({
                Bucket: this.configService.get("AWS_BUCKET_NAME"),
                Key: fileName[i],
                Body: imageFile,
                ContentType: `image/${imageType}`
            })

            if(i===0){ // 첫 번째 이미지만 await
                try{
                    await this.s3.send(command)
                    imageList.push(`${this.configService.get("AWS_CLOUD_FRONT_DN")}/${fileName[i]}`)
    
                } catch(err){
                    console.log('imageUploadToS3 : s3 업로드 에러', err)
                    throw new BadRequestException('imageUploadToS3 : s3 업로드 에러')
                }
            } else { // 나머지 이미지는 대기하지 않고 비동기 방식으로 업로드 진행
                this.s3.send(command)
                    .catch((err)=>{
                        console.log('imageUploadToS3 : s3 업로드 에러', err)
                        throw new BadRequestException('imageUploadToS3 : s3 업로드 에러')
                    })
                imageList.push(`${this.configService.get("AWS_CLOUD_FRONT_DN")}/${fileName[i]}`)
            }

        }

        return imageList
    }

```

</details>
<div style="display: flex; width: 100%;">
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/07e8de90-2ff1-44d4-8af7-f3cae8c7820a" style="width: 55%; height: 100%;"/>
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/fbad6840-2ebe-4b25-8b1d-0868c5a70e1f" style="width: 35%; height: 100%;"/>
</div>


## GIF로 비교
 
 ### 개선 전
 로딩중 팩맨이 약 3~4개를 먹습니다.
<img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/0c49ca52-0c9e-4401-b962-5839f298adf9" style="width: 50%; height: 50%;"/>


 ### 첫 번째 개선 후
 로딩중 팩맨이 약 2개를 먹습니다.
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/2d386442-644f-4435-8a9c-27bad9822de7" style="width: 50%; height: 50%;"/>

 ### 두 번째 개선 후
 로딩중 팩맨이 먹기전에 응답을 받습니다.
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/c0aae421-84ce-43a2-b587-8bde6a6e4184" style="width: 50%; height: 50%;"/>

 ### 배포 환경에서 확인
 배포 환경(AWS EC2 인스턴스)에서도 잘 작동하는 것을 확인하였습니다.
 <img src="https://github.com/asdfgl98/tastyzerocal/assets/83624652/64b328b4-bf65-40f7-a132-a7ec86d18ebe" style="width: 50%; height: 50%;"/>

### 배운점

무분별하게 비동기 처리를 위한 async / await을 사용하는 것이 아닌, 실제로 대기가 필요한 로직인지 한번 더 고민 해본 후 await을 사용하여 시간을 절약하교 효율성을 높일 수 있었습니다.

또한, 실제로 2초에서 0.65초로 속도가 개선되어 저 스스로도 더 편하다고 느껴 사용자 경험(UX)의 중요성과 서비스의 지속적인 사용과 피드백으로 개선점을 찾아나가는 것에 대한 중요성을 배웠습니다.

<br/>

## 개발 환경과 배포 환경에서의 트러블슈팅

### 문제 배경

React 프로젝트를 Docker로 컨테이너화 하여 Nginx를 사용해 배포하였는데, 개발 환경에서 발생하지 않았던 404 Not Found 에러가 발생했습니다.

### 원인

react-router를 활용하여 url 경로를 통해 컴포넌트를 교체하고 있었습니다.

localhost/user 로 이동 하면 로그인 컴포넌트가 보여지게 되지만, 이때 새로고침을 하면

Nginx 서버에 localhost/user 의 엔드포인트로 GET 요청을 하게 되어 해당 요청에 대한 응답을 설정해두지 않았기 때문에 404 Not Found 에러가 발생하게 됩니다.

### 해결

nginx.conf 파일을 작성하여 어떠한 URL 요청이 들어오더라도 index.html 파일을 반환하도록 작성해주었습니다.

Nginx에 대해 잘 모르는 상황이었지만 React의 장점인 Single Page Application과 react-router에 이해하고 있었기 때문에, 당황하지 않고 에러가 발생한 원인을 유추하여 빠르게 해결 방법을 찾을 수 있었습니다.

### 배운점

지금 내가 사용하고 있는 기술의 개념을 확실하게 알고 있다면, 오류가 발생했을 때 어떤 부분에서 오류가 발생했을지 유추하는 것이 수월하다고 생각하였습니다.

알고 있었다면 정말 간단한 오류였지만 오류가 발생한 이유를 깨닫지 못하면 많은 시간을 할애해야 해결 할 수 있기 때문입니다.

단순한 기능 구현을 위해 여기 저기서 라이브러리와 프레임워크를 가져다 사용하는 것이 아닌, 그 도구들이 무엇을 위해 만들어졌고 어떻게 사용되는지 이해를 하고 있다면 겪어보았던 오류는 물론이고, 처음 겪어보는 오류에 대해 빠르게 파악하고 대처할 수 있다는 교훈을 배웠습니다.

### 오류 해결 포스팅

### https://blog.naver.com/devnote-/223425805279




</br>

# 👍 프로젝트를 진행하며 배운점 / 느낀점

### TypeScript

기존에 TypeScript를 사용하지 않고 프로젝트를 진행했을 때 겪었던 불편함이 해소되었습니다. 

모듈화 한 함수에서 파라미터를 사용할 때 정의 된 프로퍼티가 어떠한 값인지 기억나지 않은 경우 기존에 정의해둔 Type을 통해 알기 쉬웠고, 실수로 지정된 타입이 아닌 다른 타입의 값을 넣으려고 했을 때 자동으로 에러를 발생해주어 사전에 오류를 방지할 수 있어 개발하는데 매우 편리했습니다.

### NestJS

이전 프로젝트에서 사용했던 ExpressJS와는 다르게 기본적으로 서버 아키텍처(Controller, Module, Services) 를 제공해주어 유지보수가 용이하게 작성하기 수월하였습니다.

의존성 주입을 통해 모듈별로 기능을 분리하여 코드의 재사용성을 높일 수 있었습니다.

NestJS의 Request LifeCycle중 하나인 Guard를 통해 요청 중간에 데이터를 검증하고 넘겨주었습니다.

DTO를 사용한 데이터 검증을 통해 서버에서 데이터로 발생할 오류를 미리 차단하였습니다.

### MongoDB

스키마를 자유롭게 작성하여 RDMS와는 다르게 유연한 데이터 CRUD를 경험하였습니다.

Mongoose를 활용하여 편리하게 DB를 사용하였지만, 개인적으로 RDBMS를 사용할 때처럼 SQL 문을 사용하는 것이 더 흥미가 있다고 느꼈습니다.

또한, NoSQL인 MongoDB는 Join의 개념이 없어서 사용자에 대한 게시물, 댓글등의 데이터를 사용 할 때 Refrence를 사용하였는데 RDBMS에서처럼 Join을 사용하지 못해 아쉬웠습니다.

직접 DataBase Server를 운영하지 않고, 자동으로 관리해주는 MongoDB Atlas를 사용하여 개발에 집중할 수 있었습니다.

### Docker

기존에 프로젝트를 클라우드에 배포할 때, 프로젝트를 실행하기 위한 패키지들을 모두 설치해주어야 했던 반면에 프로젝트를 이미지로 빌드하고 해당 이미지로 컨테이너화 하여 별다른 설치 없이 배포를 할 수 있었습니다.

또, docker-compose 를 활용하여 여러 컨테이너를 관리할 수 있어 기능별(클라이언트, api 통신 서버, Database 통신 서버)로 컨테이너를 나누어 배포하였습니다.
