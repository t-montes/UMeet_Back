import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from './event.entity';
import { validateEntity, getCols } from '../shared/utils';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async get(id: string): Promise<EventEntity> {
    const event = await this.eventRepository.findOne({
      where: { id },
      select: getCols(this.eventRepository), // get even the { select: false } columns
      relations: ['calendar'],
    });
    if (!event)
      throw new BadRequestException(
        'The event with the given id was not found',
      );
    return event;
  }

  @validateEntity
  async update(id: string, event: EventEntity): Promise<EventEntity> {
    const persistedEvent: EventEntity = await this.eventRepository.findOne({
      where: { id },
    });
    if (!persistedEvent)
      throw new BadRequestException(
        'The event with the given id was not found',
      );

    const mergedEvent: EventEntity = {
      ...persistedEvent,
      ...event,
    };

    mergedEvent.startDate = new Date(mergedEvent.startDate);
    mergedEvent.endDate = new Date(mergedEvent.endDate);

    // If endDate or startDate are not divisible by 5 minutes, throw an error
    if (
      mergedEvent.endDate.getTime() % 300000 !== 0 ||
      mergedEvent.startDate.getTime() % 300000 !== 0
    )
      throw new BadRequestException('The dates must be divisible by 5 minutes');

    // If endDate is prior to startDate, throw an error
    if (mergedEvent.endDate.getTime() < mergedEvent.startDate.getTime())
      throw new BadRequestException(
        'The end date must be after the start date',
      );

    mergedEvent.visualEndDate =
      mergedEvent.endDate.getTime() - mergedEvent.startDate.getTime() < 1200000
        ? new Date(mergedEvent.startDate.getTime() + 1200000) // 20 minutes
        : mergedEvent.endDate;

    // fail if day of endDate is different as day of startDate (not supported yet)
    if (
      mergedEvent.startDate.getDate() !== mergedEvent.endDate.getDate() ||
      mergedEvent.startDate.getMonth() !== mergedEvent.endDate.getMonth() ||
      mergedEvent.startDate.getFullYear() !== mergedEvent.endDate.getFullYear()
    )
      throw new BadRequestException(
        'The event must start and end on the same day',
      );

    // fail if event overlaps with another event (not supported yet)
    const events: EventEntity[] = await this.eventRepository.find({
      where: { calendar: mergedEvent.calendar },
    });
    for (const e of events) {
      if (
        (mergedEvent.startDate.getTime() >= e.startDate.getTime() &&
          mergedEvent.startDate.getTime() <= e.endDate.getTime()) ||
        (mergedEvent.endDate.getTime() >= e.startDate.getTime() &&
          mergedEvent.endDate.getTime() <= e.endDate.getTime())
      )
        throw new BadRequestException(
          'The event overlaps with another event in the same calendar',
        );
    }

    mergedEvent.id = id;

    return await this.eventRepository.save(mergedEvent);
  }

  async delete(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id },
    });
    if (!event)
      throw new BadRequestException(
        'The event with the given id was not found',
      );

    await this.eventRepository.remove(event);
  }
}
