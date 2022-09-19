/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';
import { faker } from '@faker-js/faker';
import { AirlineEntity } from '../airline/airline.entity';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];
    for(let i = 0; i < 5; i++){
        const airport: AirportEntity = await repository.save({
        name: faker.company.name(),
        code: faker.lorem.sentence(),
        country: faker.lorem.sentence(),
        city: faker.lorem.sentence(),
        });
        airportsList.push(airport);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return an airport by id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name)
    expect(airport.code).toEqual(storedAirport.code)
    expect(airport.country).toEqual(storedAirport.country)
    expect(airport.city).toEqual(storedAirport.city)
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  // it('create should return a new airport', async () => {
  //   const airport: AirportEntity = {
  //     id: "",
  //     name: faker.company.companyName(),
  //     code: faker.lorem.sentence(),
  //     country: faker.lorem.sentence(),
  //     city: faker.lorem.sentence(),
  //     airlines: airlinesList
  //   }
 
  //   const newAirport: AirportEntity = await service.create(airport);
  //   expect(newAirport).not.toBeNull();
 
  //   const storedAirport: AirportEntity = await repository.findOne({where: {id: newAirport.id}})
  //   expect(storedAirport).not.toBeNull();
  //   expect(storedAirport.name).toEqual(newAirport.name)
  //   expect(storedAirport.code).toEqual(newAirport.code)
  //   expect(storedAirport.country).toEqual(newAirport.country)
  //   expect(storedAirport.city).toEqual(newAirport.city)
  // });

  it('update should modify an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = "New name";
    airport.code = "New code";
     const updatedAirport: AirportEntity = await service.update(airport.id, airport);
    expect(updatedAirport).not.toBeNull();
     const storedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name)
    expect(storedAirport.code).toEqual(airport.code)
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: AirportEntity = airportsList[0];
    airport = {
      ...airport, name: "New name", code: "New code"
    }
    await expect(() => service.update("0", airport)).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });

  it('delete should remove an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
     const deletedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    expect(deletedAirport).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The airport with the given id was not found")
  });
});
