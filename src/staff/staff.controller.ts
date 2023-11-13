import { Controller, Inject, HttpCode, Body, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiConsumes } from '@nestjs/swagger';
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import * as path from "path";
import { multerStorage, storageDir } from "../utils";
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/staff.dto';
import { MulterDiskUploadedFiles } from './../../types';

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
        console.log(staff)
        return this.staffService.addStaffMember(staff, files)
    }

}
