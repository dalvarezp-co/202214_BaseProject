/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from '../airport/airport.dto';
import { AirportEntity } from '../airport/airport.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {

    constructor(private readonly airlineAirportService: AirlineAirportService){}

    @Post(':airlineId/airports/:airportId')
    async addAirportAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
        return await this.airlineAirportService.addAirportAirline(airlineId, airportId);
    }

    @Get(':airlineId/airports/:airportId')
    async findAirportByAirlineIdArtworkId(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
        return await this.airlineAirportService.findAirportByAirlineIdArtworkId(airlineId, airportId);
    }

    @Get(':airlineId/airports')
    async findAirportsByAirlineId(@Param('airlineId') airlineId: string){
        return await this.airlineAirportService.findAirportsByAirlineId(airlineId);
    }

    @Put(':airlineId/airports')
    async associateAirportsAirline(@Body() airportsDto: AirportDto[], @Param('airlineId') airlineId: string){
        const airports = plainToInstance(AirportEntity, airportsDto)
        return await this.airlineAirportService.associateAirportsAirline(airlineId, airports);
    }

    @Delete(':airlineId/airports/:airportId')
    @HttpCode(204)
    async deleteAirportAirline(@Param('airlineId') airlineId: string, @Param('airportId') airportId: string){
        return await this.airlineAirportService.deleteAirportAirline(airlineId, airportId);
    }
}
