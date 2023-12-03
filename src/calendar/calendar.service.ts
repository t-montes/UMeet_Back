import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { CalendarEntity } from './calendar.entity';
import { UserEntity } from '../user/user.entity';
import { GroupEntity } from '../group/group.entity';
import { EventEntity } from '../event/event.entity';
import { validateEntity } from '../shared/utils';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async getEvents(user: boolean, ownerId: string): Promise<CalendarEntity> {
    let owner: UserEntity | GroupEntity;
    if (user) {
      owner = await this.userRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The user with the given id was not found',
        );
    } else {
      owner = await this.groupRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The group with the given id was not found',
        );
    }

    return owner.calendar;
  }

  @validateEntity
  async createEvent(
    user: boolean, // true if owner is a user, false if owner is a group
    ownerId: string,
    event: EventEntity,
  ): Promise<EventEntity> {
    let owner: UserEntity | GroupEntity;
    if (user) {
      owner = await this.userRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The user with the given id was not found',
        );
    } else {
      owner = await this.groupRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar', 'calendar.events'],
      });
      if (!owner)
        throw new BadRequestException(
          'The group with the given id was not found',
        );
    }

    event.startDate = new Date(event.startDate);
    event.endDate = new Date(event.endDate);

    // If endDate or startDate are not divisible by 5 minutes, throw an error
    if (
      event.endDate.getTime() % 300000 !== 0 ||
      event.startDate.getTime() % 300000 !== 0
    )
      throw new BadRequestException('The dates must be divisible by 5 minutes');

    // If endDate is prior to startDate, throw an error
    if (event.endDate.getTime() < event.startDate.getTime())
      throw new BadRequestException(
        'The end date must be after the start date',
      );

    event.visualEndDate =
      event.endDate.getTime() - event.startDate.getTime() < 1200000
        ? new Date(event.startDate.getTime() + 1200000) // 20 minutes
        : event.endDate;

    // fail if day of endDate is different as day of startDate (not supported yet)
    if (
      event.startDate.getDate() !== event.endDate.getDate() ||
      event.startDate.getMonth() !== event.endDate.getMonth() ||
      event.startDate.getFullYear() !== event.endDate.getFullYear()
    )
      throw new BadRequestException(
        'The event must start and end on the same day',
      );

    // fail if event overlaps with another event (not supported yet)
    const events = await this.eventRepository.find({
      where: { calendar: owner.calendar },
    });
    for (const e of events) {
      if (
        (event.startDate.getTime() >= e.startDate.getTime() &&
          event.startDate.getTime() < e.endDate.getTime()) ||
        (event.endDate.getTime() > e.startDate.getTime() &&
          event.endDate.getTime() <= e.endDate.getTime()) ||
        (event.startDate.getTime() <= e.startDate.getTime() &&
          event.endDate.getTime() >= e.endDate.getTime())
      )
        throw new BadRequestException(
          'The event overlaps with another event in the same calendar',
        );
    }

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
    let owner: UserEntity | GroupEntity;
    if (user) {
      owner = await this.userRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar'],
      });
      if (!owner)
        throw new BadRequestException(
          'The user with the given id was not found',
        );
    } else {
      owner = await this.groupRepository.findOne({
        where: { id: ownerId },
        relations: ['calendar'],
      });
      if (!owner)
        throw new BadRequestException(
          'The group with the given id was not found',
        );
    }
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
