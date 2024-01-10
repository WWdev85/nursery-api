import { CanActivate, ExecutionContext } from "@nestjs/common";
import * as Api from '../../types'
import { FastifyRequest } from 'fastify'
import { AdminEntity } from "../modules/admin/admin.entity";

declare module 'fastify' {
    interface FastifyRequest {
        user: AdminEntity;
    }
}
export class AdminRoleGuard implements CanActivate {
    constructor(private readonly roles: Api.AdminRole[]) {
    }

    canActivate(context: ExecutionContext) {

        const user = context.switchToHttp().getRequest<FastifyRequest>().user

        if (this.roles.length === 0 || this.roles.includes(user?.role)) {
            return true
        }

        return false
    }
}