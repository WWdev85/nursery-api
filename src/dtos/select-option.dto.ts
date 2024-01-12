import { IsString } from "class-validator";
import { SelectOption } from "../../types";
import { ApiProperty } from "@nestjs/swagger";


export class SelectOptionDto implements SelectOption {
    @IsString()
    @ApiProperty()
    readonly search: string;
    id: string;

    @IsString()
    @ApiProperty()
    name: string;

}