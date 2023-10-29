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

  // TODO: Service Tests
});
