import * as Api from '../../types'
import {applyDecorators, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {AdminRoleGuard} from "../guards";
import {ApiExtension, ApiForbiddenResponse, ApiSecurity, ApiUnauthorizedResponse} from "@nestjs/swagger";

export const Protected = (roles: Api.AdminRole[] = [], allowQuery = false) => {


    const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [
        UseGuards(AuthGuard('jwt'), new AdminRoleGuard(roles)),
        ApiExtension('x-required-role', roles.join(', ') || 'any'),
        ApiUnauthorizedResponse(),
        ApiForbiddenResponse(),
    ]

    return applyDecorators(...decorators)
}