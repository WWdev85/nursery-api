import * as Api from '../../types';
import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Address implements Api.Address {

    @IsString()
    @ApiProperty()
    readonly houseNumber: string;

    @IsString()
    @ApiProperty()
    readonly postalCode: string;

    @IsString()
    @ApiProperty()
    readonly street: string;

    @IsString()
    @ApiProperty()
    readonly town: string;

}