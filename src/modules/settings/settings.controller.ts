import { Body, Controller, HttpCode, Inject, Post, Get, UploadedFiles, UseInterceptors, Param, Res } from '@nestjs/common';
import { ApiConsumes, ApiCreatedResponse, ApiOperation, ApiTags, ApiOkResponse, ApiNotFoundResponse } from '@nestjs/swagger';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerStorage, storageDir } from '../../utils';
import * as path from "path";

import { SettingsService } from './settings.service';
import { Protected } from 'src/decorators';
import { AdminRole, GetSettingsResponse, MulterDiskUploadedFiles, UpdateSettingsResponse } from 'types';
import { CreateSettingsDto, SettingsDto } from './dto/settings.dto';


/**
 * Settings managment
 */
@ApiTags('settings')
@Controller('settings')
export class SettingsController {
    constructor(
        @Inject(SettingsService) private settingsService: SettingsService
    ) {
    }

    /**
 * Create / Update admin panel settings
 */

    @Post('/update')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(
        FileFieldsInterceptor([
            {
                name: 'logo', maxCount: 1,
            }
        ], { storage: multerStorage(path.join(storageDir(), 'logo')) }
        )
    )
    @HttpCode(201)
    @ApiOperation({
        summary: 'Update settings',
        description: 'Body interface: `Settings`',
    })
    @ApiCreatedResponse({
        description: UpdateSettingsResponse.Success,
    })
    @Protected([AdminRole.SuperAdmin])
    async saveAdminSettings(
        @Body() adminSettings: CreateSettingsDto,
        @UploadedFiles() files: MulterDiskUploadedFiles,
    ): Promise<string> {
        return this.settingsService.saveSettings(adminSettings, files)
    }

    /**
    * Get settings
    */

    @Get('/get')
    @ApiOperation({
        summary: 'Get settings',
    })
    @ApiOkResponse({
        type: SettingsDto,
        description: 'Response interface: `SettingsDto`',
    })
    @ApiNotFoundResponse({
        description: 'Settings not found',
    })
    async getContactData(): Promise<GetSettingsResponse> {
        return await this.settingsService.getSettings()
    }

    /**
     * Get application logo.
     */

    @Get('logo/:id')
    @ApiOperation({
        summary: 'Get application logo',
    })
    async getLogo(
        @Res() res: any,
    ): Promise<any> {
        return this.settingsService.getLogo(res);
    }
}
