import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResourceModule } from './resource/resource.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { CommonModule } from './common/common.module';
import { AwsModule } from './aws/aws.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PUBLIC_FOLDER_PATH } from './common/const/path.const';

@Module({
  imports: [
    ResourceModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:`./config/.env.${process.env.NODE_ENV}`
    }),
    MongooseModule.forRoot(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@mongo-dev.umvodbt.mongodb.net/?retryWrites=true&w=majority&appName=mongo-dev`),
    UsersModule,
    AuthModule,
    ReviewsModule,
    CommonModule,
    AwsModule,
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public-img'
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
