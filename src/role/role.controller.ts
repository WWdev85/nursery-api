import { Controller, Inject, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/role.dto';

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
     * Create Role.
     */

    @Post('add')
    @ApiOperation({
        summary: 'Create role',
        description: 'Body interface: `CreateRole`',
    })
    async addRole(
        @Body() role: CreateRoleDto
    ): Promise<string> {
        return " sadas"
    }
}
