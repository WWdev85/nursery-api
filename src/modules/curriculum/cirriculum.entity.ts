import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Curriculum } from "../../../types";
import { CurriculumSubjectEntity } from "../../entities";
import * as Api from '../../../types'
import { GroupEntity } from "../group/group.entity";


@Entity('curriculum')
export class CurriculumEntity extends BaseEntity implements Curriculum {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({
        length: 20,
    })
    name: string;

    @OneToMany(() => CurriculumSubjectEntity, curriculumSubject => curriculumSubject.curriculum, { cascade: true })
    curriculumSubjects: CurriculumSubjectEntity[];

    @OneToMany(() => GroupEntity, group => group.curriculum)
    groups: GroupEntity[];

    constructor(curriculum?: Api.Curriculum) {
        super();
        this.id = curriculum?.id;
        this.name = curriculum?.name;
    }
}

