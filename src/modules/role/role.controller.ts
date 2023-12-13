import { Controller, Inject, Post, Patch, Get, Delete, Body, HttpCode, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto, RoleDto, RolesListDto } from './dto/role.dto';
import { CreateRoleResponse, UpdateRoleResponse, GetRolesListResponse, DeleteRoleResponse, AdminRole } from '../../../types';
import { ListQueryDto } from '../../dtos';
import { Protected } from '../../decorators';

/**
 * Role mamagment.
 */

@ApiTags('role')
@Controller('role')
export class RoleController {
    constructor(
        @Inject(RoleService) private roleService: RoleService
    ) {
    }

    /**
     * Create role.
     */

    @Post('add')
    @ApiOperation({
        summary: 'Create role',
        description: 'Body interface: `CreateRoleDto`',
    })
    @ApiCreatedResponse({
        description: CreateRoleResponse.Success,
    })
    @HttpCode(201)
    @Protected([AdminRole.SuperAdmin])
    async addRole(
        @Body() role: CreateRoleDto
    ): Promise<CreateRoleResponse> {
        return await this.roleService.addRole(role)
    }

    /**
     * Update role.
     */

    @Patch('update')
    @ApiOperation({
        summary: 'Update role',
        description: 'Body interface: `RoleDto`',
    })
    @ApiNotFoundResponse({
        description: UpdateRoleResponse.NotFound,
    })
    @ApiOkResponse({
        description: UpdateRoleResponse.Success,
    })
    @Protected([AdminRole.SuperAdmin])
    async updateRole(
        @Body() role: RoleDto
    ): Promise<UpdateRoleResponse> {
        return await this.roleService.updateRole(role)
    }

    /**
     * Delete role.
     */

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete role',
    })
    @ApiNotFoundResponse({
        description: DeleteRoleResponse.NotFound,
    })
    @ApiNoContentResponse({
        description: DeleteRoleResponse.Success,
    })
    @HttpCode(204)
    @Protected([AdminRole.SuperAdmin])
    async deleteRole(@Param('id') id: string) {
        await this.roleService.deleteRole(id)
    }


    /**
     * Get all roles.
     */

    @Get('get-all')
    @ApiOperation({
        summary: 'Get list of roles',
    })
    @ApiOkResponse({
        type: RolesListDto,
        description: 'Response interface: `GetRolesListResponse`',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async getRolesList(
        @Query() query: ListQueryDto
    ): Promise<GetRolesListResponse> {
        return this.roleService.getRolesList(query)
    }
}
