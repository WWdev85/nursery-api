import { IsArray, IsEmail, IsEnum, IsJSON, IsString } from "class-validator";
import { Admin, AdminRole, CreateAdmin } from "../../../../types";
import { ApiProperty } from "@nestjs/swagger";
import { StaffDto } from "../..//staff/dto/staff.dto";
import { ListDto } from "../../../dtos";

export class CreateAdminDto implements CreateAdmin {
    @IsString()
    @ApiProperty()
    readonly staffId: string;

    @IsEnum(AdminRole)
    @ApiProperty()
    readonly role: AdminRole;

}

export class AdminDto extends CreateAdminDto implements Admin {

    @IsString()
    @ApiProperty()
    readonly id: string;

    @IsString()
    @ApiProperty()
    readonly currentTokenId: string | null;

    @IsString()
    @ApiProperty()
    readonly role: AdminRole;

    @IsEmail()
    @ApiProperty()
    readonly email: string;

    @IsString()
    @ApiProperty()
    readonly passwordHash: string;
}

export class AdminPayload {
    @IsString()
    @ApiProperty()
    readonly id: string;

    @IsString()
    @ApiProperty()
    readonly role: AdminRole;

    @IsJSON()
    @ApiProperty({ type: StaffDto })
    readonly staff: StaffDto;

}

export class AdminList extends ListDto<AdminPayload>{
    @IsArray()
    @ApiProperty({ type: AdminPayload, isArray: true })
    readonly items: AdminPayload[];
}