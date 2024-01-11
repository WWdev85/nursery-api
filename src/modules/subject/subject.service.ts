import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubjectDto, SubjectDto } from './dto/subject.dto';
import { SubjectEntity } from './subject.entity';
import { CreateSubjectResponse, DeleteSubjectResponse, GetSubjectListResponse, Order, Subject, UpdateSubjectResponse } from '../../../types';
import { ListQueryDto } from 'src/dtos';
import { StaffEntity } from '../staff/staff.entity';

/**
 * Subject mamagment.
 */

@Injectable()
export class SubjectService {

    /**
     * Create subject.
     */
    async addSubject(subject: CreateSubjectDto): Promise<string> {
        try {

            if (await this.findSubjectName(subject.name)) {
                throw new HttpException(CreateSubjectResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newSubject = new SubjectEntity(subject as Subject)
            if (subject.staffIds?.length > 0) {
                const subjects = await Promise.all(subject.staffIds.split(',').map(id => this.findStaffMember(id)));
                newSubject.staffMembers = subjects.filter(subject => subject !== undefined);
            }

            await newSubject.save()
            return JSON.stringify(CreateSubjectResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
   * Update subject
   */

    async updateSubject(subject: SubjectDto): Promise<string> {
        try {
            if (!await this.findSubject(subject.id)) {
                throw new HttpException(UpdateSubjectResponse.NotFound, HttpStatus.NOT_FOUND);
            }
            if (await this.findSubjectName(subject.name, subject.id)) {
                throw new HttpException(UpdateSubjectResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newSubject = new SubjectEntity(subject as Subject)
            if (subject.staffIds?.length > 0) {
                const subjects = await Promise.all(subject.staffIds.split(',').map(id => this.findStaffMember(id)));
                newSubject.staffMembers = subjects.filter(subject => subject !== undefined);
            } else {
                newSubject.staffMembers = []
            }
            await SubjectEntity.update(subject.id, new SubjectEntity(subject as Subject))

            return JSON.stringify(UpdateSubjectResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
 * Delete subject.
 */

    async deleteSubject(id: string): Promise<DeleteSubjectResponse> {
        try {
            if (!await this.findSubject(id)) {
                throw new HttpException(DeleteSubjectResponse.NotFound, HttpStatus.NOT_FOUND);
            }
            await SubjectEntity.delete(id)
            return DeleteSubjectResponse.Success
        } catch (error) {
            throw error
        }
    }

    /**
     * Get roles list
     */

    async getSubjectsList(listQuery: ListQueryDto): Promise<GetSubjectListResponse> {
        const { search, page, limit, orderBy, order } = listQuery
        try {
            const queryBuilder = SubjectEntity.createQueryBuilder('subject')
                .leftJoinAndSelect('subject.staffMembers', 'staff')

            if (search) {
                queryBuilder.andWhere('subject.name LIKE :search', { search: `%${search}%` });
            }
            if (orderBy && order) {
                queryBuilder.addOrderBy(`subject.${orderBy}`, order.toUpperCase() as Order);
            }

            queryBuilder.skip(limit * (page - 1)).take(limit);
            const [items, count] = await queryBuilder.getManyAndCount();
            const totalPages = Math.ceil(count / limit)
            return {
                items: items,
                page: page,
                totalPages: totalPages,
                totalItems: count,
            }
        } catch (error) {
            throw error
        }
    }


    /**
     * Find subject
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
  * Check if subject name exists
  */

    async findSubjectName(name: string, id?: string): Promise<boolean> {
        try {
            let query = SubjectEntity.createQueryBuilder('subject')
                .where('subject.name = :name', { name: name });

            if (id) {
                query = query.andWhere('subject.id <> :id', { id: id });
            }
            const response = await query.getOne();
            return response ? true : false


        } catch (error) {
            throw error
        }
    }

    async findStaffMember(id: string): Promise<StaffEntity> {
        try {
            const response = await StaffEntity.createQueryBuilder('staff')
                .where('staff.id = :id', { id: id })
                .getOne();
            return response
        } catch (error) {
            throw error
        }
    }
}
