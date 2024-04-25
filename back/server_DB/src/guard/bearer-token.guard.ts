import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException, forwardRef } from "@nestjs/common";
import { AuthService } from "src/auth/auth.service";
import { UsersService } from "src/users/users.service";

@Injectable()
export class BearerTokenGuard implements CanActivate{
    constructor(
        @Inject(forwardRef(()=>AuthService))private readonly authService: AuthService,
        @Inject(forwardRef(()=>UsersService))private readonly usersService: UsersService
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()

        const rawToken = req.headers['authorization']
        if(!rawToken){
            throw new UnauthorizedException("BearerTokenGuard : 토큰이 존재하지 않습니다.")
        }

        const token = this.authService.extractTokenFromHeader(rawToken, true)

        const result = await this.authService.verifyToken(token, false)
        const user = await this.usersService.userCheck(result.sub)

        req.token = token;
        req.tokenType = result.type
        req.user = user

        return true
    }
}

@Injectable()
export class AccessTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context)

        const req = context.switchToHttp().getRequest()

        if(req.tokenType !== 'refresh'){
            throw new UnauthorizedException("Refresh 토큰이 아닙니다.")
        }
        return true
    }
}

@Injectable()
export class RefreshTokenGuard extends BearerTokenGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context)

        const req = context.switchToHttp().getRequest()

        if(req.tokenType !== 'refresh'){
            throw new UnauthorizedException("Refresh 토큰이 아닙니다.")
        }
        return true
    }
}