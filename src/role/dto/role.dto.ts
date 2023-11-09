import { IsString, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import * as Api from '../../../types';


export class CreateRoleDto implements Api.CreateRole {
    @IsString()
    @ApiProperty()
    readonly roleName: string;

    @IsEnum(Api.RoleType)
    @ApiProperty()
    readonly roleType: Api.RoleType;
}