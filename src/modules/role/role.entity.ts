import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";

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

    @OneToMany(() => StaffEntity, staff => staff.id)
    user: StaffEntity[];

    constructor(role?: Api.Role) {
        super();
        this.id = role?.id;
        this.name = role?.name;
    }
}