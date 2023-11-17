import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/admin.dto';
import { StaffEntity } from '../staff/staff.entity';
import { AdminEntity } from './admin.entity';
import { hashPwd } from '../../utils';
import { Admin, CreateAdminResponse, SendCodeResponse } from '../../../types';
import { MailService } from '../mail/mail.service';

@Injectable()

/**
 * Adminstrators managment.
 */

export class AdminService {

    constructor(
        @Inject(MailService) private mailService: MailService,
    ) {
    }
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

    /**
     * Send code
     */

    async sendCode(email: string): Promise<string> {
        const code = this.generateFourDigitCode()
        const admin = await AdminEntity.findOne({
            where: {
                email: email
            }
        })
        if (admin) {
            await this.mailService.sendMail("wasekw@gmail.com", "Kod", `${code}`)
            await AdminEntity.update(admin.id, { currentTokenId: code })
        }
        return JSON.stringify(SendCodeResponse.Success)
    }

    /**
     * Generate four digit code
     */

    generateFourDigitCode(): string {
        const code = Math.floor(1000 + Math.random() * 9000);
        return code.toString();
    }
}
