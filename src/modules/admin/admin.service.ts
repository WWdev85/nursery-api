import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/admin.dto';
import { StaffEntity } from '../staff/staff.entity';
import { AdminEntity } from './admin.entity';
import { hashPwd } from '../../utils';
import { Admin, CreateAdminResponse } from '../../../types';

@Injectable()

/**
 * Adminstrators managment.
 */

export class AdminService {

    /**
    * Create administrator.
    */

    async addAdmin(admin: CreateAdminDto): Promise<string> {

        try {
            const newAdmin = new AdminEntity(admin as unknown as Admin)

            const staffMember = await StaffEntity.createQueryBuilder('staff')
                .where('staff.id = :id', { id: admin.staffId })
                .getOne();

            if (staffMember) {
                newAdmin.staff = staffMember
                newAdmin.email = staffMember.email
                await newAdmin.save()
                return CreateAdminResponse.Success
            } else {
                throw new HttpException(CreateAdminResponse.StaffNotFound, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error
        }
    }
}
