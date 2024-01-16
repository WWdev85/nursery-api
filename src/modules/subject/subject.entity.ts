import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import * as Api from '../../../types'
import { StaffEntity } from "../staff/staff.entity";
import { CurriculumSubjectEntity } from "../../entities";

@Entity('subject')
export class SubjectEntity extends BaseEntity implements Api.Subject {

    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        unique: true,
        length: 20,
    })
    public name: string;

    @ManyToMany(() => StaffEntity, staff => staff.subjects)
    @JoinTable()
    staffMembers: StaffEntity[];

    @OneToMany(() => CurriculumSubjectEntity, curriculumSubject => curriculumSubject.subject)
    curriculumSubjects: CurriculumSubjectEntity[];

    constructor(subject?: Api.Subject) {
        super();
        this.id = subject?.id;
        this.name = subject?.name;
    }
}