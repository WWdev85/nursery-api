import { IsEmail, IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Login, RegexPattern } from "../../../../types";


export class AuthLogin implements Login {

    @IsEmail()
    @Matches(new RegExp(RegexPattern.Email))
    @ApiProperty({ default: "email@test.com" })
    readonly email: string;

    @IsString()
    @Matches(new RegExp(RegexPattern.Minimum8Characters))
    @ApiProperty()
    readonly password: string;
}