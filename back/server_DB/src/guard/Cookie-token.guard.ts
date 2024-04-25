import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class CookieTokenGuard implements CanActivate{
    constructor(
        private readonly authService: AuthService
    ){}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const {isRefreshToken} = req.body
        const {refresh_token} = req.cookies
        if(!refresh_token){
            throw new UnauthorizedException("CookieTokenGuard : 쿠키가 존재하지 않습니다.")
        }

        const verify = await this.authService.verifyToken(refresh_token, isRefreshToken)

        req.token = refresh_token
        
        return true
    }
}