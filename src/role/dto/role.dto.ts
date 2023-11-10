import { IsString, IsEnum, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ListDto, ListQueryDto } from "../../dtos";
import * as Api from '../../../types';


export class CreateRoleDto implements Api.CreateRole {
    @IsString()
    @ApiProperty()
    readonly name: string;

    @IsEnum(Api.RoleType)
    @ApiProperty()
    readonly type: Api.RoleType;
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