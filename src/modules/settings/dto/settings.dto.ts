import { IsHexColor, IsOptional, IsString, Matches } from "class-validator";
import { ApiProperty, ApiPropertyOptional, } from "@nestjs/swagger";
import { CreateSettings, RegexPattern, Settings } from "types";

export class CreateSettingsDto implements CreateSettings {

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly appName: string;

    @IsHexColor()
    @Matches(new RegExp(RegexPattern.HexColor))
    @IsOptional()
    @ApiProperty()
    readonly firstColor: string;


    @IsHexColor()
    @Matches(new RegExp(RegexPattern.HexColor))
    @IsOptional()
    @ApiProperty()
    readonly secondColor: string;

    @ApiPropertyOptional({ type: 'string', format: 'binary', })
    @IsOptional()
    logo?: Express.Multer.File

}

export class SettingsDto extends CreateSettingsDto implements Settings {
    @IsString()
    @ApiProperty()
    readonly id: string;

    @IsString()
    @ApiProperty()
    readonly logoFn: string;
}