import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { EventService } from './event.service';
import { EventEntity } from './event.entity';
import { CalendarEntity } from '../calendar/calendar.entity';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Repository<EventEntity>;
  let calendarRepository: Repository<CalendarEntity>;
  let eventList: EventEntity[] = [];
  let calendar: CalendarEntity;

  const seedDatabase = async () => {
    calendarRepository.clear();
    const newEntity = new CalendarEntity();
    newEntity.color = faker.internet.color();
    calendar = await calendarRepository.save(newEntity);

    eventRepository.clear();
    eventList = [];
    for (let i = 0; i < 5; i++) {
      const newEntity = new EventEntity();
      newEntity.name = faker.lorem.word();
      newEntity.location = faker.location.city();
      newEntity.link = faker.internet.url();
      newEntity.isPrivate = faker.datatype.boolean();
      newEntity.alert = faker.number.int();
      newEntity.startDate = faker.date.future();
      newEntity.endDate = faker.date.future();
      newEntity.visualEndDate = newEntity.endDate;
      newEntity.description = faker.lorem.paragraph();
      newEntity.color = faker.internet.color();
      newEntity.calendar = calendar;
      const event: EventEntity = await eventRepository.save(newEntity);
      eventList.push(event);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [EventService],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
    calendarRepository = module.get<Repository<CalendarEntity>>(
      getRepositoryToken(CalendarEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get should return an event by id', async () => {
    const event: EventEntity = eventList[0];
    const retrievedEvent: EventEntity = await service.get(event.id);
    expect(retrievedEvent).not.toBeNull();
    expect(retrievedEvent.id).toEqual(event.id);
  });

  it('get should throw an exception for a non-existent event', async () => {
    await expect(service.get('0')).rejects.toHaveProperty(
      'message',
      'The event with the given id was not found',
    );
  });

  it('update should modify an event', async () => {
    const event: EventEntity = eventList[0];
    event.name = 'Updated Event Name';

    const now = new Date();
    now.setMinutes(now.getMinutes() + (5 - (now.getMinutes() % 5)), 0, 0);
    event.startDate = new Date(now);
    event.endDate = new Date(now.getTime() + 30 * 60000);

    const updatedEvent: EventEntity = await service.update(event.id, event);
    expect(updatedEvent).not.toBeNull();
    expect(updatedEvent.name).toEqual('Updated Event Name');
    expect(updatedEvent.startDate.getMinutes() % 5).toEqual(0);
    expect(updatedEvent.endDate.getMinutes() % 5).toEqual(0);
  });

  it('update should throw an exception for an invalid event', async () => {
    const event: EventEntity = eventList[0];
    await expect(service.update('0', event)).rejects.toHaveProperty(
      'message',
      'The event with the given id was not found',
    );
  });

  it('update should throw an exception for invalid date times', async () => {
    const event: EventEntity = eventList[0];
    const now = new Date();
    now.setMinutes(now.getMinutes() - (now.getMinutes() % 5), 0, 0);
    event.startDate = new Date(now);
    event.endDate = new Date(now.getTime() - 5 * 60000);
    await expect(service.update(event.id, event)).rejects.toHaveProperty(
      'message',
      'The end date must be after the start date',
    );
  });

  it('delete should remove an event', async () => {
    const event: EventEntity = eventList[0];
    await service.delete(event.id);
    const deletedEvent: EventEntity = await eventRepository.findOne({
      where: { id: event.id },
    });
    expect(deletedEvent).toBeNull();
  });

  it('delete should throw an exception for a non-existent event', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'The event with the given id was not found',
    );
  });
});
