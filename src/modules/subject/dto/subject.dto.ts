import { IsString, IsArray, IsNumber, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ListDto } from "../../../dtos";
import { CreateSubject, Subject } from "../../../../types";

export class CreateSubjectDto implements CreateSubject {
    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    readonly staffIds?: string;
}

export class SubjectDto extends CreateSubjectDto implements Subject {
    @IsString()
    @ApiProperty()
    readonly id: string;


}

export class SubjectsListDto extends ListDto<SubjectDto> {
    @IsArray()
    @ApiProperty({ type: SubjectDto, isArray: true })
    readonly items: SubjectDto[];
}