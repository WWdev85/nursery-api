import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";


export class ChangePwdDto {
    @IsString()
    @ApiProperty()
    readonly oldPassword: string

    @IsString()
    @ApiProperty()
    readonly newPassword: string
}

export class SendCodePayloadDto {
    @IsEmail()
    @ApiProperty()
    readonly email: string
}

export class ResetPasswordPayload extends SendCodePayloadDto {
    @IsString()
    @ApiProperty()
    readonly code: string;

    @IsString()
    @ApiProperty()
    readonly password: string;
}