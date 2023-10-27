import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { CalendarService } from './calendar.service';
import { CalendarEntity } from './calendar.entity';
import { UserEntity } from '../user/user.entity';

describe('CalendarService', () => {
    let service: CalendarService;
    let calendarRepository: Repository<CalendarEntity>;
    let userRepository: Repository<UserEntity>;
    let calendarList: CalendarEntity[] = [];
    let user: UserEntity;

    const seedDatabase = async () => {
        calendarRepository.clear();
        calendarList = [];
        for (let i = 0; i < 5; i++) {
            const calendar: CalendarEntity = await calendarRepository.save({
                color: faker.internet.color(),
            });
            calendarList.push(calendar);
        }

        userRepository.clear();
        user = await userRepository.save({
            name: faker.person.fullName(),
            login: faker.internet.userName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        });
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
        await seedDatabase();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
