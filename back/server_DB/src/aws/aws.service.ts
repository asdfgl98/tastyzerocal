import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs'
import * as path from 'path'
import { REVIEWS_IMAGE_PATH } from 'src/common/const/path.const';

@Injectable()
export class AwsService {
    s3: S3Client
    constructor(private readonly configService: ConfigService){
        this.s3 = new S3Client({
            region: this.configService.get("AWS_REGION"),
            credentials: {
                accessKeyId: this.configService.get("AWS_ACCESS_KEY"),
                secretAccessKey: this.configService.get("AWS_SECRET_KEY")
            }
        })
    }

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

            if(i===0){
                try{
                    await this.s3.send(command)
                    imageList.push(`${this.configService.get("AWS_CLOUD_FRONT_DN")}/${fileName[i]}`)
    
                } catch(err){
                    console.log('imageUploadToS3 : s3 업로드 에러', err)
                    throw new BadRequestException('imageUploadToS3 : s3 업로드 에러')
                }
            } else {
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

    async imageDeleteToS3(url: string[]){
        for(let i=0; i< url.length; i++){
            const fileName = url[i].split('/')[1]
            const command =  new DeleteObjectCommand({
                Bucket: this.configService.get("AWS_BUCKET_NAME"),
                Key: fileName,
            })
    
            try{
                const deleteImage = await this.s3.send(command)
            } catch(err){
                console.error("imageDeleteToS3 : s3 이미지 삭제 에러", err)
                throw new BadRequestException("imageDeleteToS3 : s3 이미지 삭제 에러")
            }
        }
        return true

    }


}
