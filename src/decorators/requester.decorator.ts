import {createParamDecorator, ExecutionContext} from "@nestjs/common";

export const Requester = createParamDecorator((data, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user;
});