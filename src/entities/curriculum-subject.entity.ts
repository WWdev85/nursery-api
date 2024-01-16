import { CurriculumEntity } from "src/modules/curriculum/cirriculum.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SubjectEntity } from "src/modules/subject/subject.entity";

@Entity('curriculum-subject')
export class CurriculumSubjectEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: number;

    @ManyToOne(() => CurriculumEntity, curriculum => curriculum.id, { onDelete: "CASCADE" })
    @JoinColumn()
    curriculum: CurriculumEntity;

    @ManyToOne(() => SubjectEntity, subject => subject.id)
    @JoinColumn()
    subject: SubjectEntity;

    @Column()
    weeklyHours: number;
}