import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as Api from '../../types';

export abstract class ListDto<T> implements Api.PaginatedList<T> {
    abstract items: T[]

    @ApiProperty()
    readonly page: number

    @ApiProperty()
    readonly totalPages: number

    @ApiProperty()
    readonly totalItems: number
}

export class ListQueryDto implements Api.ListQuery {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ description: 'Current page', default: 1 })
    readonly page: number = 1;

    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ description: 'Items per page', default: 10 })
    readonly limit: number = 10;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    readonly search: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    readonly orderBy: string;


    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    readonly order: Api.Order;

}