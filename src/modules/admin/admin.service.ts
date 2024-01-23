import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AdminDto, CreateAdminDto, UpdateAdminDto } from './dto/admin.dto';
import { StaffEntity } from '../staff/staff.entity';
import { AdminEntity } from './admin.entity';
import { hashPwd } from '../../utils';
import { Admin, CreateAdminResponse, DeleteAdminResponse, EmailType, GetOneAdminResponse, GetPaginatedListOfAdmins, Order, ResetPasswordResponse, SendCodeResponse, UpdateAdminResponse, UpdatePasswordResponse, ValidateCodeResponse } from '../../../types';
import { MailService } from '../mail/mail.service';
import { ChangePwdDto, ListQueryDto, ResetPasswordPayloadDto, ValidateCodePayloadDto } from '../../dtos';
import { SettingsEntity } from '../settings/settings.entity';
import { GroupEntity } from '../group/group.entity';

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

            if (admin.groupIds?.length > 0) {
                newAdmin.groups = await Promise.all(admin.groupIds.map((id) => {
                    return this.findGroup(id)
                }));
            } else {
                newAdmin.groups = []
            }

            if (staffMember) {
                newAdmin.staff = staffMember
                newAdmin.email = staffMember.email
                await newAdmin.save()
                this.sendCode(staffMember.email, EmailType.CREATE_ADMIN)
                return JSON.stringify(CreateAdminResponse.Success)
            } else {
                throw new HttpException(CreateAdminResponse.StaffNotFound, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error
        }
    }

    /**
   * Update administrator
   */

    async updateAdmin(admin: UpdateAdminDto): Promise<string> {
        try {
            if (!await this.getOneAdmin(admin.id)) {
                throw new HttpException(UpdateAdminResponse.AdminNotFound, HttpStatus.NOT_FOUND);
            }

            const newAdmin = new AdminEntity(admin as unknown as Admin)

            const staffMember = await StaffEntity.createQueryBuilder('staff')
                .where('staff.id = :id', { id: admin.staffId })
                .getOne()

            if (admin.groupIds?.length > 0) {
                newAdmin.groups = await Promise.all(admin.groupIds.map((id) => {
                    return this.findGroup(id)
                }));
            } else {
                newAdmin.groups = []
            }

            if (staffMember) {
                newAdmin.staff = staffMember;
                newAdmin.email = staffMember.email
                console.log(newAdmin)
                await newAdmin.save()
                return JSON.stringify(UpdateAdminResponse.Success)
            } else {
                throw new HttpException(UpdateAdminResponse.StaffNotFound, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Send code
     */

    async sendCode(email: string, type: EmailType): Promise<string> {
        try {
            const code = this.generateSixDigitCode()
            const admin = await AdminEntity.createQueryBuilder('admin')
                .leftJoinAndSelect('admin.staff', 'staff')
                .where('admin.email = :email', { email: email })
                .getOne()
            if (admin) {
                const response = await SettingsEntity.find()
                const settings = response[0]
                await this.mailService.sendMail(
                    email,
                    'Zmiana hasła',
                    'layout',
                    {
                        content: type,
                        code: code,
                        appName: settings.appName,
                        url: `https://admin.${settings.appUrl}`,
                        name: admin.staff.name,
                        adminId: admin.id
                    }
                );
                await AdminEntity.update(admin.id, { currentTokenId: code })
                return JSON.stringify(SendCodeResponse.Success)
            } else {
                return JSON.stringify(SendCodeResponse.NotFound)
            }
        } catch (error) {
            throw error
        }
    }

    /**
    * Validate code
    */

    async validateCode(payload: ValidateCodePayloadDto): Promise<string> {
        const { email, code } = payload
        try {
            const admin = await AdminEntity.createQueryBuilder('admin')
                .where('admin.email = :email', { email: email })
                .andWhere('admin.currentTokenId = :code', { code: code })
                .getOne()
            if (admin) {
                return JSON.stringify(admin.id)
            } else {
                return JSON.stringify(ValidateCodeResponse.Failure)
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * ResetPassword
     */

    async resetPassword(payload: ResetPasswordPayloadDto): Promise<string> {
        const { id, password, code } = payload
        try {
            const admin = await AdminEntity.createQueryBuilder('admin')
                .where('admin.id = :id', { id: id })
                .andWhere('admin.currentTokenId = :code', { code: code })
                .getOne()
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
                .leftJoin('admin.groups', 'group')
                .addSelect(['group.id', 'group.name'])
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
                .leftJoin('admin.groups', 'group')
                .addSelect(['group.id', 'group.name'])

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

    generateSixDigitCode(): string {
        const code = Math.floor(100000 + Math.random() * 900000);
        return code.toString();
    }


    /**
    * Find Group
    */

    async findGroup(id: string): Promise<GroupEntity> {
        try {
            let query = GroupEntity.createQueryBuilder('group')
                .where('group.id = :id', { id: id });

            const response = await query.getOne();
            return response


        } catch (error) {
            throw error
        }
    }

    /**
  * Filter response fields
  */

    filter(admin: AdminEntity): GetOneAdminResponse {

        const { id, role, staff, groups } = admin
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
            groups: groups
        }
        return adminResponse
    }
}
