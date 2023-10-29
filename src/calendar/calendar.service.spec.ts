import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CalendarService } from './calendar.service';
import { CalendarEntity } from './calendar.entity';
import { UserEntity } from '../user/user.entity';
import { EventEntity } from '../event/event.entity';

describe('CalendarService', () => {
  let service: CalendarService;
  let calendarRepository: Repository<CalendarEntity>;
  let userRepository: Repository<UserEntity>;
  let eventRepository: Repository<EventEntity>;
  let calendarList: CalendarEntity[] = [];
  let usersList: UserEntity[] = [];
  let eventList: EventEntity[] = [];

  const seedDatabase = async () => {
    calendarRepository.clear();
    calendarList = [];
    for (let i = 0; i < 5; i++) {
      const newEntity = new CalendarEntity();
      newEntity.color = faker.internet.color();
      const calendar: CalendarEntity = await calendarRepository.save(newEntity);
      calendarList.push(calendar);
    }

    userRepository.clear();
    usersList = [];
    for (let i = 0; i < 5; i++) {
      const newEntity = new UserEntity();
      newEntity.name = faker.person.fullName();
      newEntity.login = faker.internet.userName();
      newEntity.email = faker.internet.email();
      newEntity.password = faker.internet.password({ prefix: 'Pw0' });
      newEntity.calendar = calendarList[i];
      const user: UserEntity = await userRepository.save(newEntity);
      usersList.push(user);
    }

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
      newEntity.calendar = calendarList[i];
      const event: EventEntity = await eventRepository.save(newEntity);
      eventList.push(event);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CalendarService],
    }).compile();

    service = module.get<CalendarService>(CalendarService);
    calendarRepository = module.get<Repository<CalendarEntity>>(
      getRepositoryToken(CalendarEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    eventRepository = module.get<Repository<EventEntity>>(
      getRepositoryToken(EventEntity),
    );
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // TODO: Service Tests
});
