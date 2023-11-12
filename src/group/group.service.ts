import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from './group.entity'; // Asumiendo que tienes una entidad definida para GroupEntity
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/interceptors/business-errors/business-errors';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {}

  async findAll(): Promise<GroupEntity[]> {
    return await this.groupRepository.find({
      relations: ['members', 'events'],
    });
  }

  async findOne(id: string): Promise<GroupEntity> {
    const group: GroupEntity = await this.groupRepository.findOne({
      where: { id },
      relations: ['members', 'events'],
    });
    if (!group)
      throw new BusinessLogicException(
        'The group with the given id was not found',
        BusinessError.NOT_FOUND,
      );
    return group;
  }

  async create(group: GroupEntity): Promise<GroupEntity> {
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
