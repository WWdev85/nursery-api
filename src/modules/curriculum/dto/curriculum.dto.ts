import { ApiProperty } from "@nestjs/swagger";
import { CreateCurriculum, Curriculum, SubjectHours } from "../../../../types";
import { IsArray, IsJSON, IsNumber, IsString } from "class-validator";
import { ListDto } from "src/dtos";

export class SubjectHoursDto {
    @IsString()
    @ApiProperty()
    readonly subjectId: string;

    @IsNumber()
    @ApiProperty()
    hours: number;
}


export class CreateCurriculumDto implements CreateCurriculum {
    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsArray()
    @ApiProperty({ type: [SubjectHoursDto] })
    readonly subjects?: SubjectHours[];
}

export class CurriculumDto extends CreateCurriculumDto implements Curriculum {
    @IsString()
    @ApiProperty()
    readonly id: string;
}

export class CurriculumsListDto extends ListDto<CurriculumDto> {
    @IsArray()
    @ApiProperty({ type: CurriculumDto, isArray: true })
    readonly items: CurriculumDto[];
}