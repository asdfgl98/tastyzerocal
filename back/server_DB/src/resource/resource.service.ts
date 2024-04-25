import { Injectable } from '@nestjs/common';
import { region, regionDocument } from './schema/region.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export interface RegionType {
    koreanRegion: string
    city: string[]
}

@Injectable()
export class ResourceService {
    constructor(@InjectModel(region.name) private regionModel: Model<regionDocument>){}

    async getResion(): Promise<region[]> {
            try{
                const result = await this.regionModel.find({}, { "__v": false})
                return result
            } catch (err) {
                console.error('지역 데이터 불러오기 오류', err)
            }

    }

    // 지역 데이터 추가
    // async createResion(): Promise<any> {
    //     try{
    //         const result = await this.regionModel.create({koreaRegion: "제주", city: ["서귀포시","저주시"]})
    //         console.log(result)
    //         return result
    //     } catch (err) {
    //         console.error('지역 데이터 추가 오류', err)
    //     }

    // }
}
