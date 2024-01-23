import { IsArray, IsObject, IsOptional, IsString } from "class-validator";
import { CreateGroup, RegexPattern } from "../../../../types";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { StaffDto } from "src/modules/staff/dto/staff.dto";
import { CurriculumDto } from "src/modules/curriculum/dto/curriculum.dto";
import { ListDto } from "src/dtos";


export class CreateGroupDto implements CreateGroup {
    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    readonly teacherId?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    readonly curriculumId?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary', })
    @IsOptional()
    readonly photo?: Express.Multer.File

}

export class UpdateGroupDto extends CreateGroupDto {
    @IsString()
    @ApiProperty()
    readonly id: string;
}

export class GroupDto extends CreateGroupDto {
    @IsObject()
    @ApiProperty()
    readonly teacher: StaffDto;

    @IsObject()
    @ApiProperty()
    readonly curriculum: CurriculumDto;
}

export class GroupListDto extends ListDto<GroupDto> {
    @IsArray()
    @ApiProperty({ type: StaffDto, isArray: true })
    readonly items: GroupDto[];
}