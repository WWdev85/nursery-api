import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin, CreateStaffResponse, DeleteStaffResponse, GetOneStaffResponse, GetPaginatedListOfStaff, MulterDiskUploadedFiles, Order, Staff, UpdateStaffResponse } from '../../../types';
import * as path from 'path';
import { unlink } from "node:fs/promises";
import { storageDir } from "../../utils";
import { CreateStaffDto, UpdateStaffDto } from './dto/staff.dto';
import { StaffEntity } from './staff.entity';
import { RoleEntity } from '../role/role.entity';
import { ListQueryDto } from '../../dtos';
import { AdminEntity } from '../admin/admin.entity';
import { SubjectEntity } from '../subject/subject.entity';


@Injectable()
export class StaffService {

    /**
     * Create staff member.
     */

    async addStaffMember(staff: CreateStaffDto, files: MulterDiskUploadedFiles): Promise<string> {
        try {
            const photo = files?.photo?.[0] ?? null
            const newStaff = new StaffEntity(staff as Staff)
            if (await this.findEmail(staff.email)) {
                throw new HttpException(CreateStaffResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const role = await this.findRole(staff.roleId)
            if (role) {
                newStaff.role = role
            } else {
                throw new HttpException(CreateStaffResponse.RoleNotFound, HttpStatus.NOT_FOUND);
            }
            if (staff.subjectIds?.length > 0) {
                const subjects = await Promise.all(staff.subjectIds.split(',').map(id => this.findSubject(id)));
                newStaff.subjects = subjects.filter(subject => subject !== undefined);
            }
            if (photo) {
                newStaff.photoFn = photo.filename
            }
            await newStaff.save()
            return JSON.stringify(CreateStaffResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
     * Update staff member.
     */

    async updateStaff(staff: UpdateStaffDto, files: MulterDiskUploadedFiles): Promise<string> {

        try {
            const photo = files?.photo?.[0] ?? null
            const newStaff = new StaffEntity(staff as Staff)
            const staffMember = await StaffEntity.createQueryBuilder('staff')
                .where('staff.id = :id', { id: staff.id })
                .getOne();
            const role = await this.findRole(staff.roleId)
            if (role) {
                newStaff.role = role
            } else {
                throw new HttpException(UpdateStaffResponse.RoleNotFound, HttpStatus.NOT_FOUND);
            }
            if (staff.subjectIds?.length > 0) {
                const subjects = await Promise.all(staff.subjectIds.split(',').map(id => this.findSubject(id)));
                newStaff.subjects = subjects.filter(subject => subject !== undefined);
            } else {
                newStaff.subjects = []
            }
            if (photo) {
                newStaff.photoFn = photo.filename
            }

            if (!staffMember) {
                throw new HttpException(UpdateStaffResponse.StaffNotFound, HttpStatus.NOT_FOUND);
            } else {
                const oldPhoto = staffMember?.photoFn
                if (oldPhoto && photo) {
                    await unlink(
                        path.join(storageDir(), 'staff', oldPhoto)
                    )
                }
                await StaffEntity.save(newStaff)
                const admin = await AdminEntity.createQueryBuilder('admin')
                    .leftJoinAndSelect('admin.staff', 'staff')
                    .where('staff.id = :id', { id: staff.id })
                    .getOne()

                const newAdmin = new AdminEntity(admin as Admin)
                newAdmin.email = staff.email
                await AdminEntity.update(admin.id, newAdmin)
                return JSON.stringify(UpdateStaffResponse.Success)
            }
        } catch (error) {
            throw error
        }
    }

    /**
  * Delete staff member.
  */

    async deleteStaffMember(id: string): Promise<DeleteStaffResponse> {
        try {

            if (this.getOneStaffMember(id)) {
                await StaffEntity.delete(id)
                return DeleteStaffResponse.Success
            } else {
                throw new HttpException(DeleteStaffResponse.StaffNotFound, HttpStatus.NOT_FOUND);
            }


        } catch (error) {
            throw error
        }

    }

    /**
     * Get one staff member.
     */

    async getOneStaffMember(id: string): Promise<GetOneStaffResponse> {
        try {
            const response = await StaffEntity.createQueryBuilder('staff')
                .leftJoinAndSelect('staff.role', 'role')
                .leftJoinAndSelect("staff.subjects", "subject")
                .where('staff.id = :id', { id: id })
                .getOne();
            return this.filter(response)
        } catch (error) {
            throw error
        }
    }


    /**
     * Get a staff member photo.
     */

    async getStaffMemberPhoto(id: string, res: any) {
        try {
            const staffMember = await this.getOneStaffMember(id)
            const photo = await this.getPhotoName(id)

            if (!staffMember) {
                throw new HttpException('Staff member not found', HttpStatus.NOT_FOUND);
            }
            if (!photo) {
                throw new HttpException('Staff member photo not found', HttpStatus.NOT_FOUND);
            }

            res.sendFile(
                photo,
                {
                    root: path.join(storageDir(), 'staff')
                }
            )
        } catch (error) {
            throw error
        }
    }

    /**
     * Get all staff members.
     */

    async getAllStaffMembers(listQuery: ListQueryDto): Promise<GetPaginatedListOfStaff> {
        const { search, page, limit, orderBy, order } = listQuery
        try {
            const queryBuilder = StaffEntity.createQueryBuilder('staff')
                .leftJoin("staff.role", "role")
                .leftJoinAndSelect("staff.subjects", "subject")
                .addSelect("role.name")

            if (search) {
                queryBuilder
                    .where('staff.name LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.surname LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.email LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.phone LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.role LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.address LIKE :search', { search: `%${search}%` })
                    .orWhere('staff.description LIKE :search', { search: `%${search}%` })
                    .orWhere('role.name LIKE :search', { search: `%${search}%` })
                    .orWhere('subject.name LIKE :search', { search: `%${search}%` })
            }

            if (orderBy && order) {
                queryBuilder.addOrderBy(`staff.${orderBy}`, order.toUpperCase() as Order);
            }

            queryBuilder.skip(limit * (page - 1)).take(limit);
            const [items, count] = await queryBuilder.getManyAndCount();
            const totalPages = Math.ceil(count / limit)
            console.log(items)

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
    * Get photo file name
    */

    async getPhotoName(id: string): Promise<string | undefined> {
        const staffMember = await StaffEntity.createQueryBuilder('staff')
            .where('staff.id = :id', { id: id })
            .getOne();
        return staffMember?.photoFn
    }

    /**
     * Check if email exists
     */

    async findEmail(email: string): Promise<boolean> {
        try {
            const response = await StaffEntity.createQueryBuilder('staff')
                .where('staff.email = :email', { email: email })
                .getOne();
            return response ? true : false
        } catch (error) {
            throw error
        }
    }

    /**
     * Check if role exists
     */

    async findRole(id: string): Promise<RoleEntity> {
        try {
            const response = await RoleEntity.createQueryBuilder('role')
                .where('role.id = :id', { id: id })
                .getOne();
            return response
        } catch (error) {
            throw error
        }
    }

    /**
     * Check if subject exists
     */

    async findSubject(id: string): Promise<SubjectEntity> {
        try {
            const response = await SubjectEntity.createQueryBuilder('subject')
                .where('subject.id = :id', { id: id })
                .getOne();
            return response
        } catch (error) {
            throw error
        }
    }

    /**
     * Filter response
     */

    filter(staffMember: StaffEntity): GetOneStaffResponse {
        const { id, name, surname, email, phone, address, role, isVisible, description, subjects } = staffMember
        const staff = {
            id: id,
            name: name,
            surname: surname,
            address: JSON.parse(address),
            role: role,
            email: email,
            phone: phone,
            isVisible: isVisible,
            description: description,
            subjects: subjects
        }
        return staff
    }


}
