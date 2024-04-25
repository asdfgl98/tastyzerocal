import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";


/** BasicToken 추출 / 디코딩 후 ID/PW 반환 GUARD */
@Injectable()
export class BasicTokenGuard implements CanActivate {
    constructor(private readonly authService: AuthService){}

    async canActivate(context: ExecutionContext):Promise<boolean>  {
        const req =context.switchToHttp().getRequest()

        const rawToken = req.headers['authorization']

        if(!rawToken){
            throw new UnauthorizedException("BasicTokenGuard : 토큰이 존재하지 않습니다.")
        }

        const token = this.authService.extractTokenFromHeader(rawToken, false)

        const { id, password } = this.authService.decodeBasicToken(token)

        req.id = id;
        req.password = password;

        return true
        
    }
}
