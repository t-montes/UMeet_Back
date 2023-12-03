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
      newEntity.color = '#123456';
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

  it('getEvents should return events for a given user', async () => {
    const user = usersList[0];
    const calendar = await service.getEvents(true, user.id);
    expect(calendar).not.toBeNull();
    expect(calendar.events).not.toBeNull();
  });

  it('getEvents should throw an exception for non-existent user', async () => {
    await expect(service.getEvents(true, '0')).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });

  it("createEvent should add an event to a user's calendar", async () => {
    const user = usersList[0];
    const event = new EventEntity();
    event.name = faker.lorem.word();
    event.location = faker.location.city();
    event.link = faker.internet.url();
    event.isPrivate = faker.datatype.boolean();
    event.alert = faker.number.int();
    const now = new Date();
    now.setMinutes(now.getMinutes() + (5 - (now.getMinutes() % 5)), 0, 0);
    event.startDate = new Date(now);
    event.endDate = new Date(now.getTime() + 30 * 60000);
    event.visualEndDate = event.endDate;
    event.description = faker.lorem.paragraph();
    event.color = '#123456';

    const createdEvent = await service.createEvent(true, user.id, event);
    expect(createdEvent).not.toBeNull();
    expect(createdEvent.id).not.toBeNull();
    expect(createdEvent.name).toEqual(event.name);
    expect(createdEvent.startDate.getMinutes() % 5).toEqual(0);
    expect(createdEvent.endDate.getMinutes() % 5).toEqual(0);
  });

  it('createEvent should throw an exception for invalid date times', async () => {
    const user = usersList[0];
    const event = new EventEntity();
    const now = new Date();
    now.setMinutes(now.getMinutes() - (now.getMinutes() % 5), 0, 0);
    event.startDate = new Date(now);
    event.endDate = new Date(now.getTime() - 5 * 60000);
    event.color = '#ffffff';

    await expect(
      service.createEvent(true, user.id, event),
    ).rejects.toHaveProperty(
      'message',
      'The end date must be after the start date',
    );
  });

  it('update should modify a calendar', async () => {
    const user = usersList[0];
    const newColor = faker.internet.color();
    user.calendar.color = newColor;

    const updatedCalendar = await service.update(true, user.id, user.calendar);
    expect(updatedCalendar).not.toBeNull();
    expect(updatedCalendar.color).toEqual(newColor);
  });

  it('update should throw an exception for non-existent user', async () => {
    const calendar = new CalendarEntity();
    calendar.color = faker.internet.color();

    await expect(service.update(true, '0', calendar)).rejects.toHaveProperty(
      'message',
      'The user with the given id was not found',
    );
  });
});
