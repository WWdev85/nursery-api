import { IsString, IsArray } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ListDto } from "../../dtos";
import { CreateRole, Role } from '../../../types';


export class CreateRoleDto implements CreateRole {
    @IsString()
    @ApiProperty()
    readonly name: string;
}

export class RoleDto extends CreateRoleDto implements Role {
    @IsString()
    @ApiProperty()
    readonly id: string;
}

export class RolesListDto extends ListDto<RoleDto> {
    @IsArray()
    @ApiProperty({ type: RoleDto, isArray: true })
    readonly items: RoleDto[];
}