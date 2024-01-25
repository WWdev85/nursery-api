import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";
import { CreateDaySchedule, DaySchedule, ScheduleEvent } from "../../../../types";
import { ListDto } from "src/dtos";


export class ScheduleEventDto implements ScheduleEvent {
    @IsString()
    @ApiProperty()
    readonly startTime: string;

    @IsString()
    @ApiProperty()
    readonly endTime: string;

    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsBoolean()
    @ApiProperty()
    readonly isLesson: boolean;

}

export class CreateDayScheduleDto implements CreateDaySchedule {
    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsArray()
    @ApiProperty({ type: ScheduleEventDto, isArray: true })
    readonly events: ScheduleEvent[];
}

export class DayScheduleDto extends CreateDayScheduleDto implements DaySchedule {
    @IsString()
    @ApiProperty()
    readonly id: string;
}

export class DaySchedulesListDto extends ListDto<DayScheduleDto> {
    @IsArray()
    @ApiProperty({ type: DayScheduleDto, isArray: true })
    readonly items: DayScheduleDto[]
}