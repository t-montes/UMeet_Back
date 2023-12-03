import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/interceptors/business-errors/business-errors';
import { CalendarEntity } from '../calendar/calendar.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
    @InjectRepository(CalendarEntity)
    private readonly calendarRepository: Repository<CalendarEntity>,
  ) {}

  async findAll(): Promise<GroupEntity[]> {
    return await this.groupRepository.find({
      relations: ['members', 'calendar', 'owner'],
    });
  }

  async findOne(id: string): Promise<GroupEntity> {
    const group: GroupEntity = await this.groupRepository.findOne({
      where: { id },
      relations: ['members', 'calendar', 'owner'],
    });
    if (!group)
      throw new BusinessLogicException(
        'The group with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return group;
  }

  async create(group: GroupEntity): Promise<GroupEntity> {
    const calendar: CalendarEntity = await this.calendarRepository.save(
      new CalendarEntity(),
    );
    group.calendar = calendar;
    return await this.groupRepository.save(group);
  }

  async update(id: string, group: GroupEntity): Promise<GroupEntity> {
    const persistedGroup: GroupEntity = await this.groupRepository.findOne({
      where: { id },
    });
    if (!persistedGroup)
      throw new BusinessLogicException(
        'The group with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return await this.groupRepository.save({ ...persistedGroup, ...group });
  }

  async delete(id: string) {
    const group: GroupEntity = await this.groupRepository.findOne({
      where: { id },
    });
    if (!group)
      throw new BusinessLogicException(
        'The group with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.groupRepository.remove(group);
  }
}
