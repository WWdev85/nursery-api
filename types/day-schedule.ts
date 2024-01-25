
export interface ScheduleEvent {
    startTime: string;
    endTime: string;
    isLesson: boolean;
}

export interface CreateDaySchedule {
    name: string,
    events: ScheduleEvent[] | string
}

export interface DaySchedule extends CreateDaySchedule {
    id: string;
}

export enum CreateDayScheduleResponse {
    Success = 'Day schedule has been added.',
    Duplicated = 'Day schedule name already exists.',
}

export enum UpdateDayScheduleResponse {
    Success = 'Day schedule has been updated.',
    Duplicated = 'Day schedule name already exists.',
    NotFound = 'Day schedule not found.',
}

export enum DeleteDayScheduleResponse {
    Success = 'Day schedule has been deleted.',
    NotFound = 'Day schedule not found.',
}

export type GetOneDayScheduleResponse = DaySchedule | null