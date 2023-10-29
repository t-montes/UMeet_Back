import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CalendarEntity } from './calendar.entity';
import { UserEntity } from '../user/user.entity';
// import { GroupEntity } from '../group/group.entity';
import { EventEntity } from '../event/event.entity';
import { validateEntity } from '../shared/utils/validator';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>, // @InjectRepository(GroupEntity) // private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async getEvents(user: boolean, ownerId: string): Promise<CalendarEntity> {
    let owner: UserEntity /* | GroupEntity */;
    if (user) {
      owner = await this.userRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The user with the given id was not found',
        );
    } /* else {
      owner = await this.groupRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The group with the given id was not found',
        );
    } */

    return owner.calendar;
  }

  async createEvent(
    user: boolean, // true if owner is a user, false if owner is a group
    ownerId: string,
    event: EventEntity,
  ): Promise<EventEntity> {
    let owner: UserEntity /* | GroupEntity */;
    if (user) {
      owner = await this.userRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The user with the given id was not found',
        );
    } /* else {
      owner = await this.groupRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The group with the given id was not found',
        );
    } */

    event.calendar = owner.calendar;
    const persistedEvent = await this.eventRepository
      .save(event)
      .catch((e: QueryFailedError) => {
        switch (+e.driverError.code) {
          case 23502: // not_null_violation
            throw new BadRequestException(
              `Field '${e.driverError.column}' is required`,
            );
          default:
            throw e;
        }
      });

    delete persistedEvent.calendar.events;

    return persistedEvent;
  }

  @validateEntity
  async update(
    user: boolean, // true if owner is a user, false if owner is a group
    ownerId: string,
    calendar: CalendarEntity,
  ): Promise<CalendarEntity> {
    let owner: UserEntity /* | GroupEntity */;
    if (user) {
      owner = await this.userRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar'],
      });
      if (!owner)
        throw new BadRequestException(
          'The user with the given id was not found',
        );
    } /* else {
      owner = await this.groupRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar'],
      });
      if (!owner)
        throw new BadRequestException(
          'The group with the given id was not found',
        );
       */
    const persistedCalendar = await this.calendarRepository.findOne({
      where: { id: owner.calendar.id },
    });
    if (!persistedCalendar)
      // this should never happen
      throw new InternalServerErrorException(
        'An error occurred while updating the calendar',
      );

    calendar.id = persistedCalendar.id;

    return await this.calendarRepository.save(calendar);
  }
}
