import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from 'src/airline/airline.entity';
import { AirlineService } from 'src/airline/airline.service';
import { AirportEntity } from 'src/airport/airport.entity';
import { AirlineAirportService } from './airline-airport.service';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  providers: [AirlineService, AirlineAirportService],
})
export class AirlineAirportModule {}
