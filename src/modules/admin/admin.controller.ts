import { Controller, Inject, Post, HttpCode, Body } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateAdminDto } from './dto/admin.dto';
import { SendCodePayloadDto } from '../../dtos';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(
        @Inject(AdminService) private adminService: AdminService
    ) {
    }

    /**
     * Create administrator.
     */

    @Post('/add')
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create administrator',
        description: 'Body interface: `CreateAdmin`',
    })
    @ApiCreatedResponse({
        description: 'Admin has been added',
    })
    async addAdmin(
        @Body() newAdmin: CreateAdminDto
    ): Promise<string> {
        return this.adminService.addAdmin(newAdmin)
    }

    /**
    * Send code
    */

    @Post('/send-code')
    @ApiOperation({
        summary: 'Send code',
        description: 'Body interface: `string`',
    })
    async sendCode(
        @Body() payload: SendCodePayloadDto,
    ): Promise<string> {
        return this.adminService.sendCode(payload.email)
    }
}
