import { Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs'
import { CreateUserDTO } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(forwardRef(()=>UsersService))private readonly usersService: UsersService
    ){}

    /**  토큰 생성 함수 */
    signToken(id: string, isRefreshToken: boolean){
        const payload = {
            sub: id,
            type: isRefreshToken? 'refresh' : 'access'
        }

        return this.jwtService.sign(payload, {
            // secret 코드
            secret: process.env.JWT_SECRET,
            // 토큰 만료 시간
            expiresIn: isRefreshToken ? 1000 * 60 * 60 * 24 * 7 : 3600
        })
    }

    /** 토큰 반환 함수 */ 
    loginUser(id: string){
        return {
            accessToken: this.signToken(id, false),
            refreshToken: this.signToken(id, true)
        }
    }

    /** ID / PW 입력 받은 후, 검증 */
    async authenticateWithIdAndPassword(user: Pick<User, 'id' | 'password'>){
        const findUser = await this.usersService.findWithIdAndPassword(user.id)
        if(!findUser){
            throw new UnauthorizedException('authenticateWithIdAndPassword : 존재하지 않는 사용자 입니다.')
        }
        
        // 입력된 비밀번호와 암호화 된 비밀번호 검증 true | false
        const passOk = await bcrypt.compare(user.password, findUser.password)
        
        if(!passOk){
            throw new UnauthorizedException('authenticateWithIdAndPassword : 비밀번호가 일치하지 않습니다..')
        }
        return findUser
    }

    /** ID 기반 로그인 함수 */
    async loginWithId(user: Pick<User, 'id' | 'password'>){
        const findUser = await this.authenticateWithIdAndPassword(user)

        return this.loginUser(findUser.id)
    }

    /** 회원가입  */
    async Join(user: CreateUserDTO){
        // hash 생성
        const hash = await bcrypt.hash(
            user.password,
            Number(process.env.HASH_ROUND)
        )

        // 회원 생성
        const newUser = await this.usersService.create({
        ...user,
        password: hash
        })

        return this.loginUser(newUser.id)
    }


    /** 헤더에서 토큰 추출 및 유효성 검사 */
     extractTokenFromHeader(header: string, isBearer: boolean){
        const splitToken = header.split(" ")
        const prefix = isBearer ? 'Bearer' : 'Basic'

        if(splitToken.length !== 2 || splitToken[0] !== prefix){
            throw new UnauthorizedException("extractTokenFromHeader : 잘못된 토큰입니다.")
        }

        const token = splitToken[1]

        return token
    }

    /** 토큰 디코딩 및 ID / PW로 split */
     decodeBasicToken(base64String: string){
        const decoded = Buffer.from(base64String, 'base64').toString('utf8')
        const split = decoded.split(':')

        if(split.length !== 2){
            throw new UnauthorizedException("잘못된 유형의 토큰입니다.")
        }

        return {
            id: split[0],
            password: split[1]
        }
    }

    /** 토큰 검증 */
    verifyToken(token: string, isRefreshToken: boolean){        
        try{
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET
            })
            return payload
        } catch(err){
            if(err.message === "jwt expired"){
                if(isRefreshToken){
                    throw new UnauthorizedException("리프레시 토큰이 만료되었습니다.", "RefreshExpired")
                }
                else{
                    throw new UnauthorizedException("엑세스 토큰이 만료되었습니다.", "AccessExpired")
                }
            }
            else{
                console.error("토큰 검증 에러", err)
                throw new UnauthorizedException("verifyToken : 토큰 검증 에러 발생")
            }

        }        
    }

    /** 토큰 재발급 */
    rotateToken(token: string, isRefreshToken: boolean){
        const decoded = this.verifyToken(token, isRefreshToken)
        if(decoded.type !== 'refresh'){
            throw new UnauthorizedException("토큰 재발급은 Refresh 토큰으로만 가능합니다.")
        }

        return this.signToken(
            decoded.sub,
            isRefreshToken)
    }

}
