import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ObjectId } from 'mongodb';
import { apiAxios } from 'src/model/axios';
import { ConfigService } from '@nestjs/config';
import { FavoriteDTO } from './dto/favorite-dto';
import { Favorite } from './schema/favorite.schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    @InjectModel(Favorite.name) private readonly FavoriteModel: Model<Favorite>,
    private readonly configService: ConfigService
  ){}

  async findAll(){
    return this.UserModel.find()
  }


  /** 회원 가입 Model */ 
  async create(createUserDto: CreateUserDto) {
    const idFind = await this.UserModel.findOne({
      id : createUserDto.id
    })
    if(idFind && idFind.loginType !== "normal"){
      const result = await this.updateSocialToken(createUserDto)
      return createUserDto
    } 
    else if(idFind) {
      throw new BadRequestException("이미 존재하는 ID 입니다.")
    }     
    
    const response = await this.UserModel.create(createUserDto)
    if(!response){
      throw new UnauthorizedException("회원가입에 실패 했습니다.")
    }

    return response;
  }

  /** 회원 조회 Model*/
  async userCheck(id: string) {
    const response = await this.UserModel.findOne({id},{
      // _id: false,
      password: false,
      createAt: false,
      updatedAt: false,
      __v: false,
      token: false
    })
    return response;
  }

  /** 로그인 ID / PW 검증 Model */
  async findWithIdAndPassword(id: string){
    const response = await this.UserModel.findOne({id},{
      _id: false,
      // password: false,
      createAt: false,
      updatedAt: false,
      __v: false,
      loginType: false,
      email: false,
      address:false,
      name:false
    })

    return response;
  }

  /**  회원 정보 수정 Model*/
  async update(id: string, updateUserDto: UpdateUserDto) {
    const response = await this.UserModel.updateOne({
      id
    },{
      $set: updateUserDto
    }
  )
  if(!response.acknowledged){
    throw new NotFoundException();
  } 
    return response.acknowledged;
  }

  /** 회원 탈퇴 Model*/
  async remove(id: string, user:any) {
      if(user.loginType === "K"){
        const response = await this.kakaoDelete(id)
        if(!response){
          throw new BadRequestException("remove : 카카오 회원 탈퇴 에러")
        }
      }
      // DB에서 회원 삭제
      const userDelete = await this.UserModel.findOneAndDelete({id})

      if(!userDelete){
        throw new BadRequestException("remove : 회원 탈퇴 DB 에러")
      }
      return true

    
  }

  /** 소셜 로그인 토큰 DB에서 SELECT */
  async getSocialToken(id: string){
    const result = await this.UserModel.findOne({id},'token')
    if(!result){
      throw new BadRequestException("getSocialToken : 소셜 로그인 토큰 find 에러")
    }
    return result.token.accessToken
  }

  /** 카카오 연결 끊기 */
  async kakaoDelete(id: string){
    try{
        // 소셜 로그인은 accessToken으로 연결 끊기
          const accessToken = await this.getSocialToken(id)
          const kakaoApi = this.configService.get('API_ORIGIN')
          const unLinkSocial = await apiAxios.post(`${kakaoApi}/kakao-login/unLink`,{
            accessToken
          })
          return true
    } catch(err){
        console.log('회원 탈퇴 에러', err)
        return false
      }
  }

  /** 소셜 로그인 재 로그인 시 토큰 업데이트 */
  async updateSocialToken(user: Pick<CreateUserDto, "id" | "token">){
    const result = await this.UserModel.findOneAndUpdate({
    id:  user.id
    },{
      token:{
        accessToken : user.token.accessToken,
        refreshToken : user.token.refreshToken
      }
    })
    return result
  }

  /** 음식점 즐겨찾기 추가 */
  async addFavorite(data: FavoriteDTO, user: any):Promise<any>{
    const duplicate = this.isDuplicate(data, user)
    const result = await this.UserModel.findByIdAndUpdate(
      user._id,
      {$push: {favoriteList: data}},
      {new: true}
    )
    if(!result){
      throw new BadRequestException("addFavorite : 즐겨찾기 추가 DB 오류 발생")
    }

    return result.favoriteList
  }
  /** 음식점 즐겨찾기 중복 에러 방지 */
  isDuplicate (data: FavoriteDTO, user: any, ){
    const result = user.favoriteList.some((item: any)=>{
      return item.id === data.id
    })

    if(result){
      throw new ForbiddenException("isDuplicate : 이미 등록된 즐겨찾기 입니다.")
    }
    
    return result
  }

  /** 음식점 즐겨찾기 해제 */
  async deleteFavorite(storeId: string, id: string){
    const findUser = await this.UserModel.findOne({id})

    if(!findUser){
      throw new BadRequestException("deleteFavorite : DB 즐겨찾기 제거 존재하지 않는 유저 ID")
    }

    const filterResult = findUser.favoriteList.filter((item)=> item.id !== storeId)
    const updateFavorite = await this.UserModel.findOneAndUpdate(
      {id},
      {favoriteList: filterResult},
      {new: true})

    if(!updateFavorite){
      throw new BadRequestException("deleteFavorite : DB 즐겨찾기 제거 실패")
    }    
    return updateFavorite.favoriteList      
  }

  async likeListUpdate(include: boolean, userId: string, postId: string){
    let result: any;
    if(include){
      result = await this.UserModel.findOneAndUpdate(
        {id: userId},
        {$pull: {likeList: postId}}
      )
    }
    else{
      result = await this.UserModel.findOneAndUpdate(
        {id: userId},
        {$push: {likeList: postId}}
      )
    }
    if(!result){
      throw new BadRequestException("likeList : 유저 좋아요 리스트 쿼리 에러")
    }
  }

  async ReviewListUpdate(isDelete: boolean, userId: string, postId: string | ObjectId){
    let result: any;
    if(isDelete){
      result = await this.UserModel.findOneAndUpdate(
        {id: userId},
        {$pull: {reviewList: postId}}
      )
    }
    else{
      result = await this.UserModel.findOneAndUpdate(
        {id: userId},
        {$push: {reviewList: postId}}
      )
    }
    if(!result){
      throw new BadRequestException("ReviewListUpdate : 리뷰 리스트 쿼리 에러")
    }

    return true
  }

  async getUserDataList(id: string){
    const result = await this.UserModel.findOne({id},
      {
        address: false,
        addressDetail: false,
        email: false,
        id: false,
        loginType: false,
        name: false,
        password: false,
        token:false,
      }    
    ).populate({path: 'likeList', populate: { path: 'createBy'}}).populate("reviewList")
    if(!result){
      throw new BadRequestException("getUserDataList : mypage 유저 정보 쿼리 오류")
    }

    return {
      favoriteList: result.favoriteList,
      likeList: result.likeList,
      reviewList: result.reviewList
    }
  }
}
