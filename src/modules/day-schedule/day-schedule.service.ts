import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDayScheduleDto, DayScheduleDto } from './dto/day-schedule.dto';
import { CreateDayScheduleResponse, DaySchedule, DeleteDayScheduleResponse, GetOneDayScheduleResponse, UpdateDayScheduleResponse } from '../../../types';
import { DayScheduleEntity } from './day-schedule.entity';

/**
 * Day schedule mamagment.
 */

@Injectable()
export class DayScheduleService {

    /**
    * Create day schedule
    */

    async addDaySchedule(daySchedule: CreateDayScheduleDto): Promise<string> {
        try {

            if (await this.findDayScheduleName(daySchedule.name)) {
                throw new HttpException(CreateDayScheduleResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newDaySchedule = new DayScheduleEntity(daySchedule as DaySchedule)
            await newDaySchedule.save()
            return JSON.stringify(CreateDayScheduleResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
    * Update day schedule
    */

    async updateDaySchedule(daySchedule: DayScheduleDto): Promise<string> {
        try {
            const currentDaySchedule = await this.getOneDaySchedule(daySchedule.id)
            if (await this.findDayScheduleName(daySchedule.name, daySchedule.id)) {
                throw new HttpException(UpdateDayScheduleResponse.Duplicated, HttpStatus.CONFLICT);
            }
            const newDaySchedule = new DayScheduleEntity(daySchedule as DaySchedule)
            DayScheduleEntity.update(currentDaySchedule.id, newDaySchedule)
            return JSON.stringify(UpdateDayScheduleResponse.Success)
        } catch (error) {
            throw error
        }
    }

    /**
     * Delete day schedule.
     */

    async deleteDaySchedule(id: string): Promise<DeleteDayScheduleResponse> {
        try {
            const daySchedule = await this.getOneDaySchedule(id)
            await DayScheduleEntity.delete(daySchedule.id)
            return DeleteDayScheduleResponse.Success
        } catch (error) {
            throw error
        }
    }

    /**
     * Get one day schedule
     */

    async getOneDaySchedule(id: string): Promise<GetOneDayScheduleResponse> {
        try {
            const response = await DayScheduleEntity.createQueryBuilder('day-schedule')
                .where('day-schedule.id = :id', { id: id })
                .getOne();
            if (response) {
                return response
            } else {
                throw new HttpException(UpdateDayScheduleResponse.NotFound, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error
        }
    }

    /**
 * Get all day schedules
 */

    async getAllDaySchedules(): Promise<GetOneDayScheduleResponse[]> {
        try {
            const response = await DayScheduleEntity.createQueryBuilder('day-schedule')
                .getMany();
            if (response) {
                return response
            } else {
                throw new HttpException(UpdateDayScheduleResponse.NotFound, HttpStatus.NOT_FOUND);
            }
        } catch (error) {
            throw error
        }
    }

    /**
    * Check if day schedule name exists
    */

    async findDayScheduleName(name: string, id?: string): Promise<boolean> {
        try {
            let query = DayScheduleEntity.createQueryBuilder('day-schedule')
                .where('day-schedule.name = :name', { name: name });

            if (id) {
                query = query.andWhere('subject.id <> :id', { id: id });
            }
            const response = await query.getOne();
            return response ? true : false


        } catch (error) {
            throw error
        }
    }
}
