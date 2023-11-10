import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

import * as Api from '../../types'

@Entity('Role')
export class RoleEntity extends BaseEntity implements Api.Role {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        unique: true,
        length: 20,
    })
    public name: string;

    @Column({
        length: 20,
    })
    public type: Api.RoleType;

    constructor(role?: Api.Role) {
        super();
        this.id = role?.id;
        this.name = role?.name;
        this.type = role?.type;
    }
}