import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/admin.dto';
import { StaffEntity } from '../staff/staff.entity';
import { AdminEntity } from './admin.entity';
import { hashPwd } from '../../utils';
import { Admin, CreateAdminResponse, DeleteAdminResponse, GetOneAdminResponse, GetPaginatedListOfAdmins, Order, ResetPasswordResponse, SendCodeResponse, UpdatePasswordResponse } from '../../../types';
import { MailService } from '../mail/mail.service';
import { ChangePwdDto, ListQueryDto, ResetPasswordPayloadDto } from '../../dtos';

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
                .getOne()

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
        const admin = await AdminEntity.createQueryBuilder('admin')
            .where('admin.email = :email', { email: email })
            .getOne()
        if (admin) {
            await this.mailService.sendMail("wasekw@gmail.com", "Kod", `${code}`)
            await AdminEntity.update(admin.id, { currentTokenId: code })
        }
        return JSON.stringify(SendCodeResponse.Success)
    }

    /**
     * ResetPassword
     */

    async resetPassword(payload: ResetPasswordPayloadDto): Promise<string> {
        const { email, password, code } = payload
        const admin = await AdminEntity.createQueryBuilder('admin')
            .where('admin.email = :email', { email: email })
            .andWhere('admin.currentTokenId = :code', { code: code })
            .getOne()
        try {
            if (admin) {
                await AdminEntity.update(admin.id, {
                    passwordHash: hashPwd(password),
                    currentTokenId: "",
                })
                return JSON.stringify(ResetPasswordResponse.Success)
            } else {
                return JSON.stringify(ResetPasswordResponse.Failure)
            }
        } catch (error) {
            throw error
        }
    }

    /**
    * Update password.
    */

    async updatePassword(admin: AdminEntity, paswords: ChangePwdDto): Promise<string> {
        try {
            const { oldPassword, newPassword } = paswords
            if (hashPwd(oldPassword) === admin.passwordHash) {
                const passwordHash = hashPwd(newPassword)
                await AdminEntity.update(admin.id, { passwordHash: passwordHash })
                return JSON.stringify(UpdatePasswordResponse.Success)
            } else {
                return JSON.stringify(UpdatePasswordResponse.Failure)
            }
        } catch (error) {
            throw error
        }
    }

    /**
 * Delete administrator.
 */

    async deleteAdmin(id: string) {
        try {
            const admin = await AdminEntity.createQueryBuilder('admin')
                .where('admin.id = :id', { id: id })
                .getOne()

            if (admin) {
                await AdminEntity.delete(id)
                return DeleteAdminResponse.Success
            } else {
                throw new HttpException(DeleteAdminResponse.AdminNotFound, HttpStatus.NOT_FOUND);
            }

        } catch (error) {
            throw error
        }
    }

    /**
  * Get one administrator.
  */

    async getOneAdmin(id: string): Promise<GetOneAdminResponse> {
        try {
            const admin = await AdminEntity.createQueryBuilder('admin')
                .leftJoinAndSelect('admin.staff', 'staff')
                .where('admin.id = :id', { id: id })
                .getOne()

            if (admin) {
                return this.filter(admin)
            } else {
                return null
            }

        } catch (error) {
            throw error
        }
    }

    /**
     * Get all administrators.
     */

    async getAllAdmins(listQuery: ListQueryDto): Promise<GetPaginatedListOfAdmins> {
        const { search, page, limit, orderBy, order } = listQuery
        try {
            const queryBuilder = AdminEntity.createQueryBuilder('admin')
                .leftJoinAndSelect('admin.staff', 'staff')

            if (search) {
                queryBuilder
                    .where('admin.role LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.name LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.surname LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.email LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.phone LIKE :search', { search: `%${search}%` })
            }

            if (orderBy && order) {
                if (orderBy === 'role') {
                    queryBuilder.addOrderBy(`admin.${orderBy}`, order.toUpperCase() as Order);
                } else {
                    queryBuilder.addOrderBy(`staff.${orderBy}`, order.toUpperCase() as Order);
                }

            }

            queryBuilder.skip(limit * (page - 1)).take(limit);
            const [items, count] = await queryBuilder.getManyAndCount();
            const totalPages = Math.ceil(count / limit)

            return {
                items: items.map(item => this.filter(item)),
                page: page,
                totalPages: totalPages,
                totalItems: count,
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Generate four digit code
     */

    generateFourDigitCode(): string {
        const code = Math.floor(1000 + Math.random() * 9000);
        return code.toString();
    }

    /**
  * Filter response fields
  */

    filter(admin: AdminEntity): GetOneAdminResponse {

        const { id, role, staff } = admin
        const adminResponse = {
            id: id,
            role: role,
            staff: {
                id: staff.id,
                name: staff.name,
                surname: staff.surname,
                address: staff.address,
                email: staff.email,
                phone: staff.phone,
                role: staff.role,
                isVisible: staff.isVisible
            },
        }
        return adminResponse
    }
}