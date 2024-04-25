import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from './schema/review.schema';
import { Model } from 'mongoose';
import { CreateReviewDTO } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(@InjectModel(Review.name) private readonly ReviewModel: Model<Review>){}

    /**리뷰 생성 Model */
    async createReview(createReview: CreateReviewDTO, s3ImageUrl:string, _id: string){
        const data = {...createReview, image:s3ImageUrl, createBy: _id}

        const result = await this.ReviewModel.create(data)
        if(!result){
            throw new BadRequestException("createReview : Review 생성 오류")
        }
        
        return true
    }

    /**모든 리뷰 조회 Model*/
    async getReviewData (){
        const result = await this.ReviewModel.find().populate('createBy', "createBy name id")
        
        if(!result){
            throw new BadRequestException("getReviewData : Review 데이터 조회 오류")
        }
        return result
    }

    async deleteAllReview(){
        const result = await this.ReviewModel.deleteMany()
        return "모든 리뷰 삭제"
    }

    async getReviewDataWithId(id: string){
        const result = await this.ReviewModel.findById(id)
        console.log(result)
    }
}
