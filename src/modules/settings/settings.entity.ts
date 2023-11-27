import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Settings } from "../../../types";

@Entity('settings')
export class SettingsEntity extends BaseEntity implements Settings {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({
        length: 25,
        nullable: false,
    })
    appName: string;

    @Column({
        length: 7,
    })
    firstColor: string;

    @Column({
        length: 7,
    })
    secondColor: string;

    @Column({
        nullable: true,
    })
    logoFn: string;

    constructor(settings?: Settings) {
        super();
        this.id = settings?.id;
        this.appName = settings?.appName;
        this.firstColor = settings?.firstColor;
        this.secondColor = settings?.secondColor;
        this.logoFn = settings?.logoFn;
    };
};