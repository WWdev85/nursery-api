
import { IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Address, RegexPattern } from '../../types';

export class AddressDto implements Address {

    @IsString()
    @Matches(new RegExp(RegexPattern.HouseNumber))
    @ApiProperty({ default: 14 })
    readonly houseNumber: string;

    @IsString()
    @Matches(new RegExp(RegexPattern.UniversalPostalCode))
    @ApiProperty({ default: "22-587" })
    readonly postalCode: string;

    @IsString()
    @Matches(new RegExp(RegexPattern.Minimum2Characters))
    @ApiProperty({ default: "Warszawska" })
    readonly street: string;

    @IsString()
    @Matches(new RegExp(RegexPattern.Minimum2Characters))
    @ApiProperty({ default: "Kraków" })
    readonly town: string;

}