import { IsDate, IsEmail, IsOptional, IsString } from "class-validator";

export class CreateUserDto{
    @IsString({
        message: "id는 string 타입을 입력해주어야 합니다."
    })
    readonly id: string;

    @IsString({
        message: "name은 string 타입을 입력해주어야 합니다."
    })
    readonly name: string;

    @IsString({
        message: "password는 string 타입을 입력해주어야 합니다."
    })
    readonly password: string;
    @IsEmail()
    @IsOptional()
    readonly email: string;

    @IsString({
        message: "address는 string 타입을 입력해주어야 합니다."
    })
    @IsOptional()
    readonly address: string

    @IsString({
        message: "addressDetail는 string 타입을 입력해주어야 합니다."
    })
    @IsOptional()
    readonly addressDetail: string

    @IsString({
        message: "loginTyped은 string 타입을 입력해주어야 합니다."
    })
    @IsOptional()
    readonly loginType: string

    @IsOptional()
    token: {
        accessToken: string,
        refreshToken: string
    }
}
