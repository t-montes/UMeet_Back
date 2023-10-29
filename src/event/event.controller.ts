import { Controller } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
//import { plainToInstance } from 'class-transformer';
//import { Post, Get, Param, Body } from '@nestjs/common';
import { EventService } from './event.service';
//import { EventDTO } from './event.dto';
//import { EventEntity } from './event.entity';

@Controller('events')
@UseInterceptors(BusinessErrorsInterceptor)
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // TODO: Get the details of an event
  // TODO: Update an event
  // TODO: Delete an event
}
