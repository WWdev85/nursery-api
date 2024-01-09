import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import * as Api from '../../../types'

@Entity('subject')
export class SubjectEntity extends BaseEntity implements Api.Subject {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        unique: true,
        length: 20,
    })
    public name: string;

    // @OneToMany(() => StaffEntity, staff => staff.role)
    // staff: StaffEntity[];

    constructor(subject?: Api.Subject) {
        super();
        this.id = subject?.id;
        this.name = subject?.name;
    }
}