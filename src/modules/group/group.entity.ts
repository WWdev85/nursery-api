import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Group } from "../../../types";
import { StaffEntity } from "../staff/staff.entity";
import { CurriculumEntity } from "../curriculum/cirriculum.entity";



@Entity('group')
export class GroupEntity extends BaseEntity implements Group {

    @PrimaryGeneratedColumn('uuid')
    public id: string;


    @Column({
        length: 20,
    })
    public name: string;

    @Column({
        default: null,
        nullable: true,
    })
    public photoFn?: string;

    @ManyToOne(() => StaffEntity, staff => staff.id)
    @JoinColumn()
    public teacher: StaffEntity;

    @ManyToOne(() => CurriculumEntity, curriculum => curriculum.id)
    @JoinColumn()
    public curriculum: CurriculumEntity;


    constructor(group?: Group) {
        super();
        this.id = group?.id;
        this.name = group?.name;
        this.photoFn = group?.photoFn;
    }

}