import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import * as Api from '../../../types'

@Entity('Role')
export class RoleEntity extends BaseEntity implements Api.Role {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        length: 20,
    })
    public roleName: string;

    @Column({
        length: 20,
    })
    public roleType: Api.RoleType;
}