import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCurriculumDto, CurriculumDto } from './dto/curriculum.dto';
import { CreateCurriculumResponse, Curriculum, DeleteCurriculumResponse, GetCurriculumListResponse, GetOneCurriculumResponse, Order, UpdateCurriculumResponse } from '../../../types';
import { CurriculumEntity } from './cirriculum.entity';
import { SubjectEntity } from '../subject/subject.entity';
import { CurriculumSubjectEntity } from 'src/entities';
import { ListQueryDto } from 'src/dtos';

@Injectable()
export class CurriculumService {

    /**
     * Create curriculum.
     */

    async addCurriculum(curriculum: CreateCurriculumDto): Promise<string> {
        try {

            if (await this.findCurriculumName(curriculum.name)) {
                throw new HttpException(CreateCurriculumResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newCurriculum = new CurriculumEntity(curriculum as Curriculum)
            const savedCurriculum = await newCurriculum.save()
            if (curriculum.subjects?.length > 0) {
                curriculum.subjects.map(async (subject) => {
                    const subjectEntity = await this.findSubject(subject.subjectId)
                    CurriculumSubjectEntity.save({
                        curriculum: savedCurriculum,
                        subject: subjectEntity,
                        weeklyHours: subject.hours
                    })
                    return subject
                });
            }
            return JSON.stringify(CreateCurriculumResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
* Update curriculum
*/

    async updateCurriculum(curriculum: CurriculumDto): Promise<string> {
        try {

            if (await this.findCurriculumName(curriculum.name, curriculum.id)) {
                throw new HttpException(CreateCurriculumResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newCurriculum = new CurriculumEntity(curriculum as Curriculum)
            const currentCurriculum = await this.getOneCurriculum(curriculum.id) as any
            const savedCurriculum = await newCurriculum.save()
            const currentCurriculumSubjects = currentCurriculum?.curriculumSubjects.map(sub => {
                if (!curriculum.subjects.find(item => item.subjectId === sub.subject.id)) {
                    CurriculumSubjectEntity.delete(sub.id)
                }
                return sub
            })
            if (curriculum.subjects?.length > 0) {
                curriculum.subjects.map(async (subject) => {
                    if (!currentCurriculumSubjects.find(item => item.subject.id === subject.subjectId)) {
                        const subjectEntity = await this.findSubject(subject.subjectId)
                        CurriculumSubjectEntity.save({
                            curriculum: savedCurriculum,
                            subject: subjectEntity,
                            weeklyHours: subject.hours
                        })
                        return subject
                    }
                });
            }
            return JSON.stringify(UpdateCurriculumResponse.Success)
        } catch (error) {
            throw error
        }
    }


    /**
* Deletee curriculum.
*/

    async deleteCurriculum(id: string): Promise<DeleteCurriculumResponse> {
        try {
            if (!await this.findCurriculum(id)) {
                throw new HttpException(DeleteCurriculumResponse.NotFound, HttpStatus.NOT_FOUND);
            }
            await CurriculumEntity.delete(id)
            return DeleteCurriculumResponse.Success
        } catch (error) {
            throw error
        }
    }


    /**
 * Get one curriculum.
 */

    async getOneCurriculum(id: string): Promise<GetOneCurriculumResponse> {
        try {
            const response = await CurriculumEntity.createQueryBuilder('curriculum')
                .leftJoinAndSelect('curriculum.curriculumSubjects', 'curriculumSubject')
                .leftJoinAndSelect('curriculumSubject.subject', 'subject')
                .where('curriculum.id = :id', { id: id })
                .getOne();
            return (response)
        } catch (error) {
            throw error
        }
    }

    /**
   * Get curriculums list
   */

    async getCurriculumsList(listQuery: ListQueryDto): Promise<GetCurriculumListResponse> {
        const { search, page, limit, orderBy, order } = listQuery
        try {
            const queryBuilder = CurriculumEntity.createQueryBuilder('curriculum')
                .leftJoinAndSelect('curriculum.curriculumSubjects', 'curriculumSubject')
                .leftJoinAndSelect('curriculumSubject.subject', 'subject')

            if (search) {
                queryBuilder.andWhere('curriculum.name LIKE :search', { search: `%${search}%` });
            }
            if (orderBy && order) {
                queryBuilder.addOrderBy(`curriculum.${orderBy}`, order.toUpperCase() as Order);
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
  * Check if curriculum name exists
  */

    async findCurriculumName(name: string, id?: string): Promise<boolean> {
        try {
            let query = CurriculumEntity.createQueryBuilder('curriculum')
                .where('curriculum.name = :name', { name: name });

            if (id) {
                query = query.andWhere('curriculum.id <> :id', { id: id });
            }
            const response = await query.getOne();
            return response ? true : false


        } catch (error) {
            throw error
        }
    }
}
