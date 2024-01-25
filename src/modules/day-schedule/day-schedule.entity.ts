import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DaySchedule, ScheduleEvent } from "types";


@Entity('day-schedule')
export class DayScheduleEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        length: 30,
    })
    public name: string;

    @Column({
        length: 2000,
    })
    public events: string;


    constructor(daySchedule?: DaySchedule) {
        super();
        this.id = daySchedule?.id;
        this.name = daySchedule?.name;
        this.events = JSON.stringify(daySchedule?.events)
    }
}