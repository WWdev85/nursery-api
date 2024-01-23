import { Controller, Inject, Post, HttpCode, Body, Patch, Delete, Get, Param, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { AdminDto, AdminListDto, AdminPayloadDto, CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { ChangePwdDto, ListQueryDto, ResetPasswordPayloadDto, SendCodePayloadDto, ValidateCodePayloadDto } from '../../dtos';
import { Protected, Requester } from '../../decorators';
import { AdminRole, EmailType, GetOneAdminResponse, GetPaginatedListOfAdmins } from '../../../types';
import { AdminEntity } from './admin.entity';

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
    @Protected([AdminRole.SuperAdmin])
    async addAdmin(
        @Body() newAdmin: CreateAdminDto
    ): Promise<string> {
        return this.adminService.addAdmin(newAdmin)
    }

    /**
    * Update administrator.
    */

    @Patch('update')
    @ApiOperation({
        summary: 'Update administrator',
        description: 'Body interface: `UpdateAdmin`',
    })
    @ApiOkResponse({
        description: 'Administrator has been updated',
    })

    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async updateStaff(
        @Body() admin: UpdateAdminDto,
    ): Promise<string> {
        return this.adminService.updateAdmin(admin)
    }


    /**
    * Send code
    */

    @Post('/send-code')
    @ApiOperation({
        summary: 'Send code',
        description: 'Body interface: SendCodePayloadDto',
    })
    async sendCode(
        @Body() payload: SendCodePayloadDto,
    ): Promise<string> {
        return this.adminService.sendCode(payload.email, EmailType.RESET_PWD)
    }

    /**
   * Validate code
   */

    @Post('/validate-code')
    @ApiOperation({
        summary: 'Validate code',
        description: 'Body interface: ValidateCodePayloadDto',
    })
    async validateCode(
        @Body() payload: ValidateCodePayloadDto,
    ): Promise<string> {
        return this.adminService.validateCode(payload)
    }

    /**
    * Reset password
    */

    @Post('/reset-pwd')
    @ApiOperation({
        summary: 'Reset password',
        description: 'Body interface: `ResetPasswordPayload`',
    })
    async resetPassword(
        @Body() payload: ResetPasswordPayloadDto,
    ): Promise<string> {
        return this.adminService.resetPassword(payload)
    }

    /**
     * Change password
     */

    @Patch('/change-pwd')
    @ApiOperation({
        summary: 'Change password',
        description: 'Body interface: `string`',
    })
    @ApiOkResponse({
        description: 'Password has been changed.',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async changePassword(
        @Body() changePwd: ChangePwdDto,
        @Requester() admin: AdminEntity
    ): Promise<string> {
        const response = await this.adminService.updatePassword(admin, changePwd)
        return response
    }

    /**
     * Delete admin.
     */

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete administrator',
    })
    @ApiNotFoundResponse({
        description: 'Administrator not found',
    })
    @ApiNoContentResponse({
        description: 'Administrator has been deleted',
    })
    @HttpCode(204)
    @Protected([AdminRole.SuperAdmin])
    async deleteAdmin(
        @Param('id') id: string,
        @Requester() admin: AdminEntity) {
        if (admin.id !== id) {
            await this.adminService.deleteAdmin(id)
        }
    }

    /**
     * Get one administrator.
     */

    @Get('get-one/:id')

    @ApiOperation({
        summary: 'Get one administrator',
    })
    @ApiOkResponse({
        type: AdminPayloadDto,
        description: 'Response interface: `AdminPayload`',
    })
    @ApiNotFoundResponse({
        description: 'Staff member not found',
    })
    @Protected([AdminRole.SuperAdmin])
    async getOneAdmin(
        @Param('id') id: string,
        @Requester() admin: AdminEntity,
    ): Promise<GetOneAdminResponse> {
        return await this.adminService.getOneAdmin(id)
    }

    /**
    * Get all admins.
    */

    @Get('get-all')
    @ApiOperation({
        summary: 'Get list of administrators',
    })
    @ApiOkResponse({
        type: AdminListDto,
        description: 'Response interface: `AdminList`',
    })
    @Protected([AdminRole.SuperAdmin])
    async getAllAdmins(
        @Requester() admin: AdminEntity,
        @Query() query: ListQueryDto
    ): Promise<GetPaginatedListOfAdmins> {
        return this.adminService.getAllAdmins(query)
    }
}