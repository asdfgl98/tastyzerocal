import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDTO {
    @IsString({
        message: "id는 string 타입을 입력해주어야 합니다."
    })
    @ApiProperty({example:'test', description: '유저 id'})
    readonly id: string;

    @IsString({
        message: "name은 string 타입을 입력해주어야 합니다."
    })
    @ApiProperty({example:'jihun', description: '유저 name'})
    readonly name: string;

    @IsString({
        message: "password는 string 타입을 입력해주어야 합니다."
    })
    @ApiProperty({example:'test123', description: '유저 password'})
    readonly password: string;

    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional({example:'test@test.com', description: '유저 email'})
    readonly email: string;
    
    @IsString({
        message: "address는 string 타입을 입력해주어야 합니다."
    })
    @IsOptional()
    @ApiPropertyOptional({example:'광주 북구 동문대로 123번길 45', description: '유저 address'})
    readonly address: string
    
    @IsString({
        message: "addressDetail는 string 타입을 입력해주어야 합니다."
    })
    @IsOptional()
    @ApiPropertyOptional({example:'123아파트 456동 789호', description: '유저 addressDetail'})
    readonly addressDetail: string
    
    @IsString({
        message: "loginType은 string 타입을 입력해주어야 합니다."
    })
    @IsOptional()
    @ApiPropertyOptional({ description: '로그인 타입',example:'normal'})
    readonly loginType: string
    
    @IsOptional()
    @ApiPropertyOptional({description: 'Social Login Token'})
    readonly token: {
        accessToken: string,
        refreshToken: string
    }
}
