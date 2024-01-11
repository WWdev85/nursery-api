import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import * as Api from '../../../types'
import { StaffEntity } from "../staff/staff.entity";

@Entity('subject')
export class SubjectEntity extends BaseEntity implements Api.Subject {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        unique: true,
        length: 20,
    })
    public name: string;

    @ManyToMany(() => StaffEntity, staff => staff.id)
    @JoinTable()
    staff: StaffEntity[];

    constructor(subject?: Api.Subject) {
        super();
        this.id = subject?.id;
        this.name = subject?.name;
    }
}