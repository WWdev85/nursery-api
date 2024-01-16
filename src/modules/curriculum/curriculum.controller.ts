import { Controller, Inject, Post, HttpCode, Body, Patch, Delete, Param, Query, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import { AdminRole, CreateCurriculumResponse, CreateSubjectResponse, Curriculum, DeleteCurriculumResponse, DeleteSubjectResponse, GetCurriculumListResponse, GetOneCurriculumResponse, GetSubjectListResponse, UpdateCurriculumResponse, UpdateSubjectResponse } from '../../../types';
import { Protected } from '../../decorators';
import { CreateCurriculumDto, CurriculumDto, CurriculumsListDto } from './dto/curriculum.dto';
import { ListQueryDto } from '../../dtos';

/**
 * Curriculum mamagment.
 */



@ApiTags('curriculum')
@Controller('curriculum')
export class CurriculumController {
    constructor(
        @Inject(CurriculumService) private curriculumService: CurriculumService
    ) { }

    /**
     * Create curriculum.
     */

    @Post('add')
    @ApiOperation({
        summary: 'Create curriculum',
        description: 'Body interface: `CreateCurriculumDto`',
    })
    @ApiCreatedResponse({
        description: CreateCurriculumResponse.Success,
    })
    @HttpCode(201)
    @Protected([AdminRole.SuperAdmin])
    async addCurriculum(
        @Body() curriculum: CreateCurriculumDto
    ): Promise<string> {
        return await this.curriculumService.addCurriculum(curriculum)
    }

    /**
   * Update curriculum.
   */

    @Patch('update')
    @ApiOperation({
        summary: 'Update curriculum',
        description: 'Body interface: `Curriculumto`',
    })
    @ApiNotFoundResponse({
        description: UpdateCurriculumResponse.NotFound,
    })
    @ApiOkResponse({
        description: UpdateCurriculumResponse.Success,
    })
    @Protected([AdminRole.SuperAdmin])
    async updateRole(
        @Body() curriculum: CurriculumDto
    ): Promise<string> {
        return await this.curriculumService.updateCurriculum(curriculum)
    }


    /**
* Delete curriculum.
*/

    @Delete('delete/:id')
    @ApiOperation({
        summary: 'Delete curriculum',
    })
    @ApiNotFoundResponse({
        description: DeleteCurriculumResponse.NotFound,
    })
    @ApiNoContentResponse({
        description: DeleteCurriculumResponse.Success,
    })
    @HttpCode(204)
    @Protected([AdminRole.SuperAdmin])
    async deleteRole(@Param('id') id: string) {
        await this.curriculumService.deleteCurriculum(id)
    }


    /**
 * Get one curriculum.
 */

    @Get('get-one/:id')
    @ApiOperation({
        summary: 'Get one curriculum',
    })
    @ApiOkResponse({
        type: CurriculumDto,
        description: 'Response interface: `StaffDto`',
    })
    @ApiNotFoundResponse({
        description: 'Staff member not found',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async getOneStaffMember(@Param('id') id: string,): Promise<GetOneCurriculumResponse> {
        return await this.curriculumService.getOneCurriculum(id)

    }

    /**
    * Get all curriculums.
    */

    @Get('get-all')
    @ApiOperation({
        summary: 'Get list of curriculums',
    })
    @ApiOkResponse({
        type: CurriculumsListDto,
        description: 'Response interface: `GetCurriculumsListResponse`',
    })
    @Protected([AdminRole.SuperAdmin, AdminRole.GroupAdmin])
    async getRolesList(
        @Query() query: ListQueryDto
    ): Promise<GetCurriculumListResponse> {
        return this.curriculumService.getCurriculumsList(query)
    }

}

