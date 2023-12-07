import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSettings, GetSettingsResponse, MulterDiskUploadedFiles, Settings, UpdateSettingsResponse } from 'types';
import { SettingsEntity } from './settings.entity';
import { unlink } from 'node:fs/promises';
import * as path from 'path';
import { storageDir } from 'src/utils';

/**
 * Settings managment.
 */

@Injectable()
export class SettingsService {

    /**
     * Update admin settings.
     */
    async saveSettings(settings: CreateSettings, files: MulterDiskUploadedFiles): Promise<string> {
        const logo = files?.logo?.[0] ?? null


        try {
            const newSettings = new SettingsEntity(settings as Settings)
            const response = await SettingsEntity.find()
            const oldSettings = response[0]
            if (logo) {
                newSettings.logoFn = logo.filename
            }
            if (oldSettings) {
                if (oldSettings.logoFn && logo) {
                    await unlink(
                        path.join(storageDir(), 'logo', oldSettings.logoFn)
                    )
                }
                await SettingsEntity.update(oldSettings.id, newSettings)
            } else {
                const response = await newSettings.save()
                if (!response) {
                    throw new Error()
                }
            }
            return UpdateSettingsResponse.Success
        } catch (error) {
            try {
                if (logo) {
                    await unlink(
                        path.join(storageDir(), 'logo', logo.filename)
                    )
                }
            } catch (unlinkError) { }
            throw error
        }
    }

    /**
    * Get settings.
    */
    async getSettings(): Promise<GetSettingsResponse> {
        try {
            const response = await SettingsEntity.find()
            const settings = response[0]
            if (settings) {
                return this.filter(settings)
            } else {
                throw new HttpException('Settings not found', HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Get app logo.
     */

    async getLogo(res: any) {
        try {
            const adminSettings = (await SettingsEntity.find())[0]
            if (!adminSettings) {
                throw new HttpException('Settings not found', HttpStatus.NOT_FOUND);
            }
            if (!adminSettings.logoFn) {
                throw new HttpException('Logo not found', HttpStatus.NOT_FOUND);
            }
            res.sendFile(
                adminSettings.logoFn,
                {
                    root: path.join(storageDir(), 'logo')
                }
            )
        } catch (error) {
            throw error
        }
    }

    /**
    * Filter response fields
    */

    filter(settings: SettingsEntity): GetSettingsResponse {

        const { id, appName, firstColor, secondColor, appUrl } = settings
        return {
            id: id,
            firstColor: firstColor,
            secondColor: secondColor,
            appUrl: appUrl,
            appName: appName
        }

    }
}
