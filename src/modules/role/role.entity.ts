import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

import * as Api from '../../../types'
import { StaffEntity } from "../staff/staff.entity";

@Entity('role')
export class RoleEntity extends BaseEntity implements Api.Role {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        unique: true,
        length: 20,
    })
    public name: string;

    @Column({
        unsigned: true,
    })
    public order: number;

    @OneToMany(() => StaffEntity, staff => staff.role)
    staff: StaffEntity[];

    constructor(role?: Api.Role) {
        super();
        this.id = role?.id;
        this.name = role?.name;
        this.order = role?.order;
    }
}