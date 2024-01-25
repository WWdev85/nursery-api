import { Controller, Inject, Post, HttpCode, Body, Patch, Delete, Param, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { SubjectService } from './subject.service';
import { AdminRole, CreateSubjectResponse, DeleteSubjectResponse, GetSubjectListResponse, UpdateSubjectResponse } from '../../../types';
import { Protected } from '../../decorators';
import { CreateSubjectDto, SubjectDto, SubjectsListDto } from './dto/subject.dto';
import { ListQueryDto } from '../../dtos';

/**
 * Subject mamagment.
 */

@ApiTags('subject')
@Controller('subject')
export class SubjectController {
    constructor(
        @Inject(SubjectService) private subjectService: SubjectService
    ) {
    }

    /**
     * Create subject.
     */

    @Post('add')
    @ApiOperation({
        summary: 'Create subject',
        description: 'Body interface: `CreateSubjectDto`',
    })
    @ApiCreatedResponse({
        description: CreateSubjectResponse.Success,
    })
    @HttpCode(201)
    @Protected([AdminRole.SuperAdmin])
    async addSubject(
        @Body() subject: CreateSubjectDto
    ): Promise<string> {
        return await this.subjectService.addSubject(subject)
    }

    /**
    * Update subject.
    */

    @Patch('update')
    @ApiOperation({
        summary: 'Update subject',
        description: 'Body interface: `SubjectDto`',
    })
    @ApiNotFoundResponse({
        description: UpdateSubjectResponse.NotFound,
    })
    @ApiOkResponse({
        description: UpdateSubjectResponse.Success,
    })
    @Protected([AdminRole.SuperAdmin])
    async updateSubject(
        @Body() subject: SubjectDto
    ): Promise<string> {
        return await this.subjectService.updateSubject(subject)
    }

    /**
    * Delete subject.
    */

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete subject',
    })
    @ApiNotFoundResponse({
        description: DeleteSubjectResponse.NotFound,
    })
    @ApiNoContentResponse({
        description: DeleteSubjectResponse.Success,
    })
    @HttpCode(204)
    @Protected([AdminRole.SuperAdmin])
    async deleteRole(@Param('id') id: string) {
        await this.subjectService.deleteSubject(id)
    }

    /**
  * Get all subjects.
  */

    @Get('get-all')
    @ApiOperation({
        summary: 'Get list of subjects',
    })
    @ApiOkResponse({
        type: SubjectsListDto,
        description: 'Response interface: `GetSubjectListResponse`',
    })
    @Protected([AdminRole.SuperAdmin])
    async getRolesList(
        @Query() query: ListQueryDto
    ): Promise<GetSubjectListResponse> {
        return this.subjectService.getSubjectsList(query)
    }
}
