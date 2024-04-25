import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";
import { ExecutionContextHost } from "@nestjs/core/helpers/execution-context-host";

/** req 객체에서 ID와 PASSWORD 반환 데코레이터 */
export const User = createParamDecorator((data, context: ExecutionContext)=>{
    const req = context.switchToHttp().getRequest();

    const user = {
        id: req.id,
        password: req.password
    }

    if(!user){
        throw new InternalServerErrorException("User데코레이터 : Request에 id 또는 password 프로퍼티가 존재하지 않습니다.");
    }

    return user;
})
