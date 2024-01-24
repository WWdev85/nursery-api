import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { AdminRole, CreateGroupResponse, DeleteGroupResponse, GetOneGroupResponse, GetPaginatedListOfGroups, Group, MulterDiskUploadedFiles, Order, UpdateGroupResponse } from '../../../types';
import { GroupEntity } from './group.entity';
import { StaffEntity } from '../staff/staff.entity';
import { CurriculumEntity } from '../curriculum/cirriculum.entity';
import { unlink } from "node:fs/promises";
import * as path from 'path';
import { storageDir } from '../../utils';
import { ListQueryDto } from 'src/dtos';
import { AdminEntity } from '../admin/admin.entity';
import { QueryBuilder } from 'typeorm';

@Injectable()
export class GroupService {


    /**
     * Create group.
     */
    async addGroup(group: CreateGroupDto, files: MulterDiskUploadedFiles): Promise<string> {
        try {
            const photo = files?.photo?.[0] ?? null
            if (await this.findGroupName(group.name)) {
                throw new HttpException(CreateGroupResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const teacher = await this.findTeacher(group.teacherId)
            const curriculum = await this.findCurriculum(group.curriculumId)
            const newGroup = new GroupEntity(group as Group)
            if (teacher) {
                newGroup.teacher = teacher
            } else {
                throw new HttpException(CreateGroupResponse.TeacherNotFound, HttpStatus.NOT_FOUND);
            }
            if (curriculum) {
                newGroup.curriculum = curriculum
            } else {
                throw new HttpException(CreateGroupResponse.CurriculumNotFound, HttpStatus.NOT_FOUND);
            }
            if (photo) {
                newGroup.photoFn = photo.filename
            }

            if (group.adminIds?.length > 0) {
                newGroup.admins = await Promise.all(group.adminIds.map((id) => {
                    return this.findAdmin(id)
                }));
            } else {
                newGroup.admins = []
            }
            await newGroup.save()
            return JSON.stringify(CreateGroupResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
     * Update group.
     */
    async updateGroup(group: UpdateGroupDto, files: MulterDiskUploadedFiles): Promise<string> {
        try {
            const photo = files?.photo?.[0] ?? null
            if (await this.findGroupName(group.name, group.id)) {
                throw new HttpException(CreateGroupResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const currentGroup = await GroupEntity.createQueryBuilder('group')
                .where('group.id = :id', { id: group.id })
                .getOne();
            const newGroup = new GroupEntity(group as Group)

            if (group.curriculumId) {
                const curriculum = await this.findCurriculum(group.curriculumId)
                if (curriculum) {
                    newGroup.curriculum = curriculum
                } else {
                    throw new HttpException(CreateGroupResponse.CurriculumNotFound, HttpStatus.NOT_FOUND);
                }
            } else {
                newGroup.curriculum = null
            }

            if (group.teacherId) {
                const teacher = await this.findTeacher(group.teacherId)
                if (teacher) {
                    newGroup.teacher = teacher
                } else {
                    throw new HttpException(CreateGroupResponse.TeacherNotFound, HttpStatus.NOT_FOUND);
                }
            } else {
                newGroup.teacher = null
            }
            if (photo) {
                newGroup.photoFn = photo.filename
            } else {
                if (currentGroup.photoFn) {
                    newGroup.photoFn = currentGroup.photoFn
                }
            }
            if (currentGroup) {
                const oldPhoto = currentGroup?.photoFn
                if (oldPhoto && photo) {
                    await unlink(
                        path.join(storageDir(), 'groups', oldPhoto)
                    )
                }
            } else {
                throw new HttpException(UpdateGroupResponse.GroupNotFound, HttpStatus.NOT_FOUND);
            }

            if (group.adminIds?.length > 0) {
                newGroup.admins = await Promise.all(group.adminIds.map((id) => {
                    return this.findAdmin(id)
                }));
            } else {
                newGroup.admins = []
            }

            await newGroup.save()
            return JSON.stringify(UpdateGroupResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
    * Delete group.
    */

    async deleteGroup(id: string): Promise<DeleteGroupResponse> {
        try {
            if (await this.getOneGroup(id)) {
                await GroupEntity.delete(id)
                return DeleteGroupResponse.Success
            } else {
                throw new HttpException(DeleteGroupResponse.StaffNotFound, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error
        }
    }

    /**
     * Get one group.
     */

    async getOneGroup(id: string): Promise<GetOneGroupResponse> {
        try {
            const response = await GroupEntity.createQueryBuilder('group')
                .leftJoin('group.teacher', 'teacher')
                .addSelect(['teacher.id', 'teacher.name', 'teacher.surname'])
                .leftJoinAndSelect("group.curriculum", "curriculum")
                .leftJoinAndSelect("group.admins", "admin")
                .leftJoinAndSelect("admin.staff", "staff")
                .where('group.id = :id', { id: id })
                .getOne();
            return this.filter(response)
        } catch (error) {
            throw error
        }
    }

    /**
     * Get a staff member photo.
     */

    async getGroupPhoto(id: string, res: any) {
        try {
            const group = await this.getOneGroup(id)
            const photo = await this.getPhotoName(id)

            if (!group) {
                throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
            }
            if (!photo) {
                throw new HttpException('Group photo not found', HttpStatus.NOT_FOUND);
            }

            res.sendFile(
                photo,
                {
                    root: path.join(storageDir(), 'groups')
                }
            )
        } catch (error) {
            throw error
        }
    }

    /**
     * Get all staff members.
     */

    async getAllGroups(listQuery: ListQueryDto, requester: AdminEntity): Promise<GetPaginatedListOfGroups> {
        const { search, page, limit, orderBy, order } = listQuery
        try {
            const queryBuilder = GroupEntity.createQueryBuilder('group')
                .leftJoin('group.teacher', 'teacher')
                .addSelect(['teacher.id', 'teacher.name', 'teacher.surname'])
                .leftJoinAndSelect("group.curriculum", "curriculum")
                .leftJoinAndSelect("group.admins", "admin")
                .leftJoinAndSelect("admin.staff", "staff")

            if (search) {
                queryBuilder
                    .where('group.name LIKE :search', { search: `%${search}%` })
                    .orWhere('teacher.surname LIKE :search', { search: `%${search}%` })
                    .orWhere('teacher.name LIKE :search', { search: `%${search}%` })
                    .orWhere('curriculum.name LIKE :search', { search: `%${search}%` })
            }
            if (requester.role === AdminRole.GroupAdmin && requester.groups.length > 0) {
                queryBuilder
                    .andWhere('group.id IN (:...groupIds)', { groupIds: requester.groups });
            }

            if (orderBy && order) {
                queryBuilder.addOrderBy(`group.${orderBy}`, order.toUpperCase() as Order);
            }

            queryBuilder.skip(limit * (page - 1)).take(limit);
            const [items, count] = await queryBuilder.getManyAndCount();
            const totalPages = Math.ceil(count / limit)


            return {
                items: items.map((item: any) => {
                    if (item.teacher)
                        item.teacher.fullName = item.teacher.name + " " + item.teacher.surname;
                    return this.filter(item)
                }),
                page: page,
                totalPages: totalPages,
                totalItems: count,
            }
        } catch (error) {
            throw error
        }
    }

    /**
   * Check if admin exists
   */

    async findAdmin(id: string): Promise<AdminEntity> {
        try {
            let query = AdminEntity.createQueryBuilder('admin')
                .where('admin.id = :id', { id: id });
            const response = await query.getOne();
            return response
        } catch (error) {
            throw error
        }
    }


    /**
    * Check if group name exists
    */

    async findGroupName(name: string, id?: string): Promise<boolean> {
        try {
            let query = GroupEntity.createQueryBuilder('group')
                .where('group.name = :name', { name: name });

            if (id) {
                query = query.andWhere('group.id <> :id', { id: id });
            }
            const response = await query.getOne();
            return response ? true : false


        } catch (error) {
            throw error
        }
    }

    /**
     * Check if teacher exists
     */

    async findTeacher(id: string): Promise<StaffEntity> {
        try {
            const response = await StaffEntity.createQueryBuilder('staff')
                .where('staff.id = :id', { id: id })
                .getOne();
            return response
        } catch (error) {
            throw error
        }
    }


    /**
    * Check if curriculum exists
    */

    async findCurriculum(id: string): Promise<CurriculumEntity> {
        try {
            const response = await CurriculumEntity.createQueryBuilder('curriculum')
                .where('curriculum.id = :id', { id: id })
                .getOne();
            return response
        } catch (error) {
            throw error
        }
    }

    /**
    * Get photo file name
    */

    async getPhotoName(id: string): Promise<string | undefined> {
        const group = await GroupEntity.createQueryBuilder('group')
            .where('group.id = :id', { id: id })
            .getOne();
        return group?.photoFn
    }

    /**
* Filter response fields
*/

    filter(group: GroupEntity): GetOneGroupResponse {

        const { id, name, admins, curriculum, teacher } = group
        const groupResponse = {
            id: id,
            name: name,
            curriculum: curriculum,
            teacher: teacher,
            admins: admins.map(admin => {
                return {
                    id: admin.id,
                    name: admin.staff.name + ' ' + admin.staff.surname
                }
            })
        }
        return groupResponse
    }

}
