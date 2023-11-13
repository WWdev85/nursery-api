import { Injectable } from '@nestjs/common';
import { MulterDiskUploadedFiles, Staff } from '../../types';
import { CreateStaffDto } from './dto/staff.dto';
import { StaffEntity } from './staff.entity';

@Injectable()
export class StaffService {

    /**
     * Create staff member.
     */

    async addStaffMember(staff: CreateStaffDto, files: MulterDiskUploadedFiles): Promise<string> {
        try {
            const photo = files?.photo?.[0] ?? null
            const newStaff = new StaffEntity(staff as Staff)
            if (photo) {
                newStaff.photoFn = photo.filename
            }
            console.log(newStaff)
            const response = await newStaff.save()
            return response.id
        } catch (error) {
            throw error
        }
    }
}
