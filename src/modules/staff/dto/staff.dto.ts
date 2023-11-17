import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsEmail, IsJSON, IsObject, IsOptional, IsString, Matches } from "class-validator";
import { CreateStaff, RegexPattern, Staff, UpdateStaff } from '../../../../types';
import { AddressDto, ListDto } from "../../../dtos";
import { RoleEntity } from "../../role/role.entity";
import { RoleDto } from "../..//role/dto/role.dto";

export class CreateSaffWithoutFileDto implements CreateStaff {
    @IsString()
    @Matches(new RegExp(RegexPattern.Minimum2Characters))
    @ApiProperty({ default: "name" })
    readonly name: string;

    @IsString()
    @Matches(new RegExp(RegexPattern.Minimum2Characters))
    @ApiProperty({ default: "surname" })
    readonly surname: string;

    @IsJSON()
    @ApiProperty({ type: AddressDto })
    readonly address: AddressDto;

    @IsEmail()
    @Matches(new RegExp(RegexPattern.Email))
    @ApiProperty({ default: "email@test.com" })
    readonly email: string;

    @IsString()
    @Matches(new RegExp(RegexPattern.PhoneNumber))
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
}

export class CreateStaffDto extends CreateSaffWithoutFileDto implements CreateStaff {
    @ApiPropertyOptional({ type: 'string', format: 'binary', })
    @IsOptional()
    readonly photo?: Express.Multer.File
}

export class UpdateStaffDto extends CreateStaffDto implements UpdateStaff {
    @IsString()
    @ApiProperty()
    readonly id: string;
}

export class StaffDto extends CreateSaffWithoutFileDto implements Omit<Staff, 'roleId'> {
    @IsString()
    @ApiProperty()
    readonly id: string;

    @IsObject()
    @ApiProperty()
    readonly role: RoleDto;
}

export class StaffListDto extends ListDto<StaffDto> {
    @IsArray()
    @ApiProperty({ type: StaffDto, isArray: true })
    readonly items: StaffDto[];
}

