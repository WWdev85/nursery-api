import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsEnum, IsJSON, IsObject, IsOptional, IsString, IsArray } from "class-validator";
import * as Api from '../../../types';
import { Address } from "../../dtos";

export class CreateStaffDto implements Api.CreateStaff {
    @IsString()
    @ApiProperty({ default: "name" })
    readonly name: string;

    @IsString()
    @ApiProperty({ default: "surname" })
    readonly surname: string;

    @IsJSON()
    @ApiProperty({ type: Address })
    readonly address: Address;

    @IsEmail()
    @ApiProperty({ default: "email@test.com" })
    readonly email: string;

    @IsString()
    @ApiProperty({ default: "123456789" })
    readonly phone: string;

    @IsBoolean()
    @ApiProperty({ default: true })
    readonly isVisible: boolean;

    @IsString()
    @ApiProperty()
    readonly roleId: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false })
    readonly description?: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary', })
    @IsOptional()
    readonly photo?: Express.Multer.File
}
