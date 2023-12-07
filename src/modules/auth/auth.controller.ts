import { Body, Controller, Get, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from "express";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { AdminRole } from "../../../types";
import { AuthService } from "./auth.service";
import { AuthLogin } from "./dto/auth.dto";
import { Protected, Requester } from "../../decorators";
import { AdminEntity } from "../../modules/admin/admin.entity";


@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    /**
     * Login.
     */

    @Post('/login')
    @ApiOperation({
        summary: 'Login',
    })
    async login(
        @Req() host: Request,
        @Body() req: AuthLogin,
        @Res() res: Response
    ): Promise<any> {
        return this.authService.login(req, res, host.get('host'));
    }

    /**
     * Logout.
     */

    @Get('/logout')
    @ApiOperation({
        summary: 'Logout',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async logout(
        @Req() host: Request,
        @Requester() admin: AdminEntity,
        @Res() res: Response
    ) {
        console.log(admin)
        return this.authService.logout(admin, res, host.get('host'))
    }

    /**
     * Auth token validation.
     */

    @Get('/check')
    @ApiOperation({
        summary: 'Auth token validation',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async check(
        @Requester() admin: AdminEntity,
    ): Promise<string> {
        console.log(admin)
        return await this.authService.check(admin)
    }
}
