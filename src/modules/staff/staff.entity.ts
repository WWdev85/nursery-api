import { BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Staff } from '../../../types'
import { RoleEntity } from "../role/role.entity";
import { AdminEntity } from "../admin/admin.entity";
import { SubjectEntity } from "../subject/subject.entity";


@Entity('staff')
export class StaffEntity extends BaseEntity implements Staff {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        length: 20,
    })
    public name: string;

    @Column({
        length: 20,
    })
    public surname: string;

    @Column({
        length: 500,
    })
    public address: string;

    @Column({
        length: 50,
        unique: true,
    })
    public email: string;

    @Column()
    public isVisible: boolean;

    @Column({
        length: 12,
    })
    public phone: string;

    @Column({
        length: 500,
    })
    public description: string;

    @Column({
        default: null,
        nullable: true,
    })
    public photoFn: string;

    @ManyToOne(() => RoleEntity, role => role.id, { nullable: false })
    @JoinColumn()
    public role: RoleEntity;

    @OneToOne(type => AdminEntity, { cascade: true })
    public admin: AdminEntity;

    @ManyToMany(() => SubjectEntity, subject => subject.id)
    @JoinTable()
    subjects: SubjectEntity[];

    constructor(staff?: Staff) {
        super();
        this.id = staff?.id;
        this.name = staff?.name;
        this.surname = staff?.surname;
        this.address = staff?.address as string;
        this.email = staff?.email;
        this.phone = staff?.phone;
        this.isVisible = staff?.isVisible;
        this.description = staff?.description;
        this.photoFn = staff?.photoFn;
    }

}