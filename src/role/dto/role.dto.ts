import { IsString, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ListDto } from "../../dtos";
import * as Api from '../../../types';


export class CreateRoleDto implements Api.CreateRole {
    @IsString()
    @ApiProperty()
    readonly name: string;
}

export class RoleDto extends CreateRoleDto implements Api.Role {
    @IsString()
    @ApiProperty()
    readonly id: string;
}

export class RolesListDto extends ListDto<RoleDto> {
    @IsArray()
    @ApiProperty({ type: RoleDto, isArray: true })
    readonly items: RoleDto[];
}