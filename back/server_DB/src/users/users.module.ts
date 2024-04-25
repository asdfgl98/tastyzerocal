import { BadRequestException, Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Favorite, FavoriteSchema } from './schema/favorite.schema';
import { AuthModule } from 'src/auth/auth.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { AwsModule } from 'src/aws/aws.module';


@Module({
  imports:[
    MongooseModule.forFeature([{
      name: User.name,
      schema: UserSchema
    },{
      name: Favorite.name,
      schema: FavoriteSchema
    }]),
    forwardRef(()=>AuthModule),
    ReviewsModule,
    AwsModule
  ],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
