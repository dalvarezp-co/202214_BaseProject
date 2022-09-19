/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class AirlineDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;
 
    @IsString()
    @IsNotEmpty()
    readonly description: string;
 
    @IsString()
    @IsNotEmpty()
    readonly foundingDate: string;
 
    @IsString()
    @IsNotEmpty()
    readonly webPage: string;
}
