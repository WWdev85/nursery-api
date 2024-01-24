import { BaseEntity, Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { StaffEntity } from "../staff/staff.entity";
import { Admin, AdminRole } from "../../../types";
import { GroupEntity } from "../group/group.entity";


@Entity('admin')
export class AdminEntity extends BaseEntity implements Admin {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        default: null,
        nullable: true,
    })
    currentTokenId: string;

    @Column({
        length: 50,
        unique: true,
    })
    public email: string;

    @Column({
        length: 128,
    })
    passwordHash: string;

    @Column({
        length: 10,
    })
    role: AdminRole;

    @OneToOne(type => StaffEntity, { onDelete: "CASCADE", nullable: false, eager: true })
    @JoinColumn()
    staff: StaffEntity;

    @ManyToMany(() => GroupEntity, group => group.admins)
    groups: GroupEntity[];

    constructor(admin?: Admin) {
        super();
        this.id = admin?.id;
        this.currentTokenId = admin?.currentTokenId;
        this.email = admin?.email;
        this.passwordHash = admin?.passwordHash;
        this.role = admin?.role;
    }
}