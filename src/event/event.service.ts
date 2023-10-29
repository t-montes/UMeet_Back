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

    event.id = id;

    return await this.eventRepository.save(event);
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
