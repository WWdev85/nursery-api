import { Controller, Inject, HttpCode, Body, Get, Post, Patch, UploadedFiles, UseInterceptors, Delete, Param, Res, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiConsumes, ApiOkResponse, ApiNotFoundResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import { multerStorage, storageDir } from "../../utils";
import { StaffService } from './staff.service';
import { CreateStaffDto, StaffDto, StaffListDto, UpdateStaffDto } from './dto/staff.dto';
import { GetOneStaffResponse, GetPaginatedListOfStaff, MulterDiskUploadedFiles } from './../../../types';
import { ListQueryDto } from '../../dtos';

/**
 * Staff mamagment.
 */


@ApiTags('staff')
@Controller('staff')
export class StaffController {
    constructor(
        @Inject(StaffService) private staffService: StaffService
    ) {
    }

    /**
 * Create staff member.
 */

    @Post('add')
    @ApiOperation({
        summary: 'Create staff member',
        description: 'Body interface: `CreateStaff`',
    })
    @ApiCreatedResponse({
        description: 'Staff member has been added',
    })
    @HttpCode(201)
    @ApiConsumes('multipart/form-data')

    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo', maxCount: 1,
            }
        ], { storage: multerStorage(path.join(storageDir(), 'staff')) }
        )
    )
    async addStaff(
        @Body() staff: CreateStaffDto,
        @UploadedFiles() files: MulterDiskUploadedFiles,
    ): Promise<string> {
        return this.staffService.addStaffMember(staff, files)
    }

    /**
    * Update staff member.
    */

    @Patch('update')
    @ApiOperation({
        summary: 'Update staff member',
        description: 'Body interface: `UpdateStaff`',
    })
    @ApiOkResponse({
        description: 'Staff member has been updated',
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'photo', maxCount: 1,
            }
        ], { storage: multerStorage(path.join(storageDir(), 'staff')) }
        )
    )
    async updateStaff(
        @Body() staff: UpdateStaffDto,
        @UploadedFiles() files: MulterDiskUploadedFiles,
    ): Promise<string> {
        return this.staffService.updateStaff(staff, files)
    }

    /**
   * Delete staff member.
   */

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete staff member',
    })
    @ApiNotFoundResponse({
        description: 'Staff member not found',
    })
    @ApiNoContentResponse({
        description: 'Staff member has been deleted',
    })
    @HttpCode(204)

    async deleteStaffMember(@Param('id') id: string,) {
        await this.staffService.deleteStaffMember(id)
    }

    /**
     * Get one staff member.
     */

    @Get('get-one/:id')
    @ApiOperation({
        summary: 'Get one staff member',
    })
    @ApiOkResponse({
        type: StaffDto,
        description: 'Response interface: `StaffDto`',
    })
    @ApiNotFoundResponse({
        description: 'Staff member not found',
    })

    async getOneStaffMember(@Param('id') id: string,): Promise<GetOneStaffResponse> {
        const response = await this.staffService.getOneStaffMember(id)
        return response

    }

    /**
 * Get a staff member photo.
 */

    @Get('get-photo/:id')
    @ApiOperation({
        summary: 'Get a staff member photo',
    })
    @ApiOkResponse({
        description: 'Response interface: File',
    })
    @ApiNotFoundResponse({
        description: 'Photo not found',
    })
    async getStaffMemberPhoto(
        @Param('id') id: string,
        @Res() res: any,
    ): Promise<any> {
        return await this.staffService.getStaffMemberPhoto(id, res)
    }

    /**
    * Get all staff members.
    */

    @Get('get-all')
    @ApiOperation({
        summary: 'Get list of staff members',
    })
    @ApiOkResponse({
        type: StaffListDto,
        description: 'Response interface: `StaffList`',
    })
    async getAllStaffMembers(@Query() query: ListQueryDto): Promise<GetPaginatedListOfStaff> {
        return this.staffService.getAllStaffMembers(query)
    }

}
