import { Controller, Inject, Post, HttpCode, Body, Patch, Delete, Param, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { DayScheduleService } from './day-schedule.service';
import { AdminRole, CreateDayScheduleResponse, CreateSubjectResponse, DeleteDayScheduleResponse, DeleteSubjectResponse, GetOneDayScheduleResponse, GetSubjectListResponse, UpdateDayScheduleResponse, UpdateSubjectResponse } from '../../../types';
import { Protected } from '../../decorators';
import { ListQueryDto } from '../../dtos';
import { CreateDayScheduleDto, DayScheduleDto } from './dto/day-schedule.dto';

@ApiTags('day-schedule')
@Controller('day-schedule')
export class DayScheduleController {
    constructor(
        @Inject(DayScheduleService) private dayScheduleService: DayScheduleService
    ) {
    }

    /**
     * Create day schedule
     */

    @Post('add')
    @ApiOperation({
        summary: 'Create day schedule',
        description: 'Body interface: `CreateDayScheduleDto`',
    })
    @ApiCreatedResponse({
        description: CreateDayScheduleResponse.Success,
    })
    @HttpCode(201)
    @Protected([AdminRole.SuperAdmin])
    async addDaySchedule(
        @Body() daySchedule: CreateDayScheduleDto
    ): Promise<string> {
        return await this.dayScheduleService.addDaySchedule(daySchedule)
    }

    /**
    * Update day schedule.
    */

    @Patch('update')
    @ApiOperation({
        summary: 'Update day schedule',
        description: 'Body interface: `DayScheduleDto`',
    })
    @ApiNotFoundResponse({
        description: UpdateDayScheduleResponse.NotFound,
    })
    @ApiOkResponse({
        description: UpdateDayScheduleResponse.Success,
    })
    @Protected([AdminRole.SuperAdmin])
    async updateDaySchedule(
        @Body() daySchedule: DayScheduleDto
    ): Promise<string> {
        return await this.dayScheduleService.updateDaySchedule(daySchedule)
    }

    /**
    * Delete day schedule.
    */

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete day schedule',
    })
    @ApiNotFoundResponse({
        description: DeleteDayScheduleResponse.NotFound,
    })
    @ApiNoContentResponse({
        description: DeleteDayScheduleResponse.Success,
    })
    @HttpCode(204)
    @Protected([AdminRole.SuperAdmin])
    async deleteDaySchedule(@Param('id') id: string) {
        await this.dayScheduleService.deleteDaySchedule(id)
    }

    /**
    * Get one day schedule.
    */

    @Get('get-one/:id')
    @ApiOperation({
        summary: 'Get one day schedule',
    })
    @ApiOkResponse({
        type: DayScheduleDto,
        description: 'Response interface: `DayScheduleDto`',
    })
    @ApiNotFoundResponse({
        description: 'Day schedule not found',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async getOneDaySchedule(
        @Param('id') id: string,
    ): Promise<GetOneDayScheduleResponse> {
        return await this.dayScheduleService.getOneDaySchedule(id)
    }

    /**
   * Get all day schedules.
   */

    @Get('get-all')
    @ApiOperation({
        summary: 'Get all day schedules',
    })
    @ApiOkResponse({
        type: DayScheduleDto,
        description: 'Response interface: `DayScheduleDto[]`',
    })
    @ApiNotFoundResponse({
        description: 'Day schedule not found',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async getAllDaySchedules(): Promise<GetOneDayScheduleResponse[]> {
        return await this.dayScheduleService.getAllDaySchedules()
    }

}
