import { Controller, Inject, Post, HttpCode, Body, Patch, Delete, Param, Query, Get, UseInterceptors, UploadedFiles, Res, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiNoContentResponse, ApiConsumes } from '@nestjs/swagger';
import { Protected, Requester } from '../../decorators';

import { GroupService } from './group.service';
import { CreateGroupDto, GroupDto, GroupListDto, UpdateGroupDto } from './dto/group.dto';
import { AdminRole, CreateGroupResponse, GetOneGroupResponse, GetPaginatedListOfGroups, MulterDiskUploadedFiles } from '../../../types';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, storageDir } from '../../utils';
import * as path from 'path';
import { ListQueryDto } from 'src/dtos';
import { AdminEntity } from '../admin/admin.entity';


@ApiTags('group')
@Controller('group')
export class GroupController {
    constructor(
        @Inject(GroupService) private groupService: GroupService
    ) {
    }
    /**
     * Create group.
     */

    @Post('add')
    @ApiOperation({
        summary: 'Create group',
        description: 'Body interface: `CreateGroupDto`',
    })
    @ApiCreatedResponse({
        description: CreateGroupResponse.Success,
    })
    @HttpCode(201)
    @ApiConsumes('multipart/form-data')

    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo', maxCount: 1,
            }
        ], { storage: multerStorage(path.join(storageDir(), 'groups')) }
        )
    )
    @Protected([AdminRole.SuperAdmin])
    async addGroup(
        @Body() group: CreateGroupDto,
        @UploadedFiles() files: MulterDiskUploadedFiles,
    ): Promise<string> {
        return await this.groupService.addGroup(group, files)
    }

    /**
* Update group.
*/

    @Patch('update')
    @ApiOperation({
        summary: 'Update group',
        description: 'Body interface: `UpdateGroup`',
    })
    @ApiOkResponse({
        description: 'Group has been updated',
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo', maxCount: 1,
            }
        ], { storage: multerStorage(path.join(storageDir(), 'groups')) }
        )
    )
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async updateGroup(
        @Body() group: UpdateGroupDto,
        @UploadedFiles() files: MulterDiskUploadedFiles,
        @Requester() requester: AdminEntity,
    ): Promise<string> {

        if (requester.groups.find(g => g.id === group.id)) {
            return this.groupService.updateGroup(group, files)
        }
        else {
            throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        }
    }

    /**
    * Delete group.
    */

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete group',
    })
    @ApiNotFoundResponse({
        description: 'Group not found',
    })
    @ApiNoContentResponse({
        description: 'Group has been deleted',
    })
    @HttpCode(204)
    @Protected([AdminRole.SuperAdmin])
    async deleteGroup(@Param('id') id: string,) {
        await this.groupService.deleteGroup(id)
    }

    /**
  * Get one group.
  */

    @Get('get-one/:id')
    @ApiOperation({
        summary: 'Get one group',
    })
    @ApiOkResponse({
        type: GroupDto,
        description: 'Response interface: `StaffDto`',
    })
    @ApiNotFoundResponse({
        description: 'Staff member not found',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async getOneGroup(
        @Param('id') id: string,
        @Requester() requester: AdminEntity
    )
        : Promise<GetOneGroupResponse> {
        if (requester.groups.find(group => group.id === id)) {
            return await this.groupService.getOneGroup(id)
        }
        else {
            throw new HttpException('Forbidden resource', HttpStatus.FORBIDDEN);
        }

    }

    /**
    * Get group photo.
    */

    @Get('get-photo/:id')
    @ApiOperation({
        summary: 'Get group photo',
    })
    @ApiOkResponse({
        description: 'Response interface: File',
    })
    @ApiNotFoundResponse({
        description: 'Photo not found',
    })
    async getGroupPhoto(
        @Param('id') id: string,
        @Res() res: any,
    ): Promise<any> {
        return await this.groupService.getGroupPhoto(id, res)
    }

    /**
  * Get all groups.
  */

    @Get('get-all')
    @ApiOperation({
        summary: 'Get list of groups',
    })
    @ApiOkResponse({
        type: GroupListDto,
        description: 'Response interface: `GroupList`',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async getAllGroups(
        @Query() query: ListQueryDto,
        @Requester() requester: AdminEntity
    ): Promise<GetPaginatedListOfGroups> {
        return this.groupService.getAllGroups(query, requester)
    }
}
