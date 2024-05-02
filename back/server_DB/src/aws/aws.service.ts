import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs'
import * as path from 'path'
import { PUBLIC_FOLDER_PATH, REVIEWS_IMAGE_PATH } from 'src/common/const/path.const';

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

    async imageUploadToS3(fileName: string){
        const filePath = path.join(REVIEWS_IMAGE_PATH, fileName)
        const imageFile =  fs.readFileSync(filePath)
        const imageType = fileName.split(".")[1]

        const command = new PutObjectCommand({
            Bucket: this.configService.get("AWS_BUCKET_NAME"),
            Key: fileName,
            Body: imageFile,
            ContentType: `image/${imageType}`
        })

        try{
            const upload = await this.s3.send(command)
            return `${this.configService.get("AWS_CLOUD_FRONT_DN")}/${fileName}`

        } catch(err){
            console.log('imageUploadToS3 : s3 업로드 에러', err)
            throw new BadRequestException('imageUploadToS3 : s3 업로드 에러')
        }
    }

    async imageDeleteToS3(url: string){
        const fileName = url.split('/')[1]
        console.log(fileName)
        const command =  new DeleteObjectCommand({
            Bucket: this.configService.get("AWS_BUCKET_NAME"),
            Key: fileName,
        })

        try{
            const deleteImage = await this.s3.send(command)
            return true
        } catch(err){
            console.error("imageDeleteToS3 : s3 이미지 삭제 에러", err)
            throw new BadRequestException("imageDeleteToS3 : s3 이미지 삭제 에러")
        }

    }


}
