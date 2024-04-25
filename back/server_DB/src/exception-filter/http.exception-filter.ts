import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { tokenDeleteToCookies } from "src/Utils/JWT-Utils";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()
        const status = exception.getStatus()
        const err = exception.getResponse()
        
        // 리프레시 토큰이 만료되었다면 Cookie에서 제거
        if(exception.message === "리프레시 토큰이 만료되었습니다."){
            tokenDeleteToCookies(response, 'refresh_token')
        }

        response
            .status(status)
            .json({
                path: request.url,
                timestamp: new Date().toLocaleString('kr'),
                error: err
            })
    }
}