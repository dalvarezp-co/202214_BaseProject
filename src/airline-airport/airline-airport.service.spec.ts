/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { faker } from '@faker-js/faker';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airlineRepository: Repository<AirlineEntity>;
  let airportRepository: Repository<AirportEntity>;
  let airline: AirlineEntity;
  let airportsList : AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();
 
    airportsList = [];
    for(let i = 0; i < 5; i++){
        const airport: AirportEntity = await airportRepository.save({
          name: faker.company.name(),
          code: faker.lorem.sentence(),
          country: faker.lorem.sentence(),
          city: faker.lorem.sentence(),
        })
        airportsList.push(airport);
    }
 
    airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundingDate: faker.lorem.sentence(),
      webPage: faker.lorem.sentence(),
      airports: airportsList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportAirline should add an airport to an airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.sentence(),
      country: faker.lorem.sentence(),
      city: faker.lorem.sentence(),
    });
 
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundingDate: faker.lorem.sentence(),
      webPage: faker.lorem.sentence(),
    })
 
    const result: AirlineEntity = await service.addAirportAirline(newAirline.id, newAirport.id);
   
    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toBe(newAirport.name)
    expect(result.airports[0].code).toBe(newAirport.code)
    expect(result.airports[0].country).toBe(newAirport.country)
    expect(result.airports[0].city).toBe(newAirport.city)
  });

  it('addAirportAirline should thrown exception for an invalid airport', async () => {
    const newAirline: AirlineEntity = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.lorem.sentence(),
      foundingDate: faker.lorem.sentence(),
      webPage: faker.lorem.sentence(),
    })
 
    await expect(() => service.addAirportAirline(newAirline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('addAirportAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.sentence(),
      country: faker.lorem.sentence(),
      city: faker.lorem.sentence(),
    });
 
    await expect(() => service.addAirportAirline("0", newAirport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportByAirlineIdArtworkId should return airport by airline', async () => {
    const airport: AirportEntity = airportsList[0];
    const storedAirport: AirportEntity = await service.findAirportByAirlineIdArtworkId(airline.id, airport.id, )
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toBe(airport.name);
    expect(storedAirport.code).toBe(airport.code);
    expect(storedAirport.country).toBe(airport.country);
    expect(storedAirport.city).toBe(airport.city);
  });

  it('findAirportByAirlineIdArtworkId should throw an exception for an invalid airport', async () => {
    await expect(()=> service.findAirportByAirlineIdArtworkId(airline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('findAirportByAirlineIdArtworkId should throw an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(()=> service.findAirportByAirlineIdArtworkId("0", airport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('findAirportByAirlineIdArtworkId should throw an exception for an airport not associated to the airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.sentence(),
      country: faker.lorem.sentence(),
      city: faker.lorem.sentence(),
    });
 
    await expect(()=> service.findAirportByAirlineIdArtworkId(airline.id, newAirport.id)).rejects.toHaveProperty("message", "The airport with the given id is not associated to the airline");
  });

  it('findAirportsByAirlineId should return airports by airline', async ()=>{
    const airports: AirportEntity[] = await service.findAirportsByAirlineId(airline.id);
    expect(airports.length).toBe(5)
  });

  it('findAirportsByAirlineId should throw an exception for an invalid airline', async () => {
    await expect(()=> service.findAirportsByAirlineId("0")).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('associateAirportsAirline should update airports list for a airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.sentence(),
      country: faker.lorem.sentence(),
      city: faker.lorem.sentence(),
    });
 
    const updatedAirline: AirlineEntity = await service.associateAirportsAirline(airline.id, [newAirport]);
    expect(updatedAirline.airports.length).toBe(1);
 
    expect(updatedAirline.airports[0].name).toBe(newAirport.name);
    expect(updatedAirline.airports[0].code).toBe(newAirport.code);
    expect(updatedAirline.airports[0].country).toBe(newAirport.country);
    expect(updatedAirline.airports[0].city).toBe(newAirport.city);
  });

  it('associateAirportsAirline should throw an exception for an invalid airline', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.sentence(),
      country: faker.lorem.sentence(),
      city: faker.lorem.sentence(),
    });
 
    await expect(()=> service.associateAirportsAirline("0", [newAirport])).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('associateAirportsAirline should throw an exception for an invalid airport', async () => {
    const newAirport: AirportEntity = airportsList[0];
    newAirport.id = "0";
 
    await expect(()=> service.associateAirportsAirline(airline.id, [newAirport])).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('deleteAirportAirline should remove an airport from an airline', async () => {
    const airport: AirportEntity = airportsList[0];
   
    await service.deleteAirportAirline(airline.id, airport.id);
 
    const storedAirline: AirlineEntity = await airlineRepository.findOne({where: {id: airline.id}, relations: ["airports"]});
    const deletedAirport: AirportEntity = storedAirline.airports.find(a => a.id === airport.id);
 
    expect(deletedAirport).toBeUndefined();
 
  });

  it('deleteAirportAirline should thrown an exception for an invalid airport', async () => {
    await expect(()=> service.deleteAirportAirline(airline.id, "0")).rejects.toHaveProperty("message", "The airport with the given id was not found");
  });

  it('deleteAirportAirline should thrown an exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect(()=> service.deleteAirportAirline("0", airport.id)).rejects.toHaveProperty("message", "The airline with the given id was not found");
  });

  it('deleteAirportAirline should thrown an exception for an non asocciated airport', async () => {
    const newAirport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.lorem.sentence(),
      country: faker.lorem.sentence(),
      city: faker.lorem.sentence(),
    });
 
    await expect(()=> service.deleteAirportAirline(airline.id, newAirport.id)).rejects.toHaveProperty("message", "The airport with the given id is not associated to the airline");
  });
});
