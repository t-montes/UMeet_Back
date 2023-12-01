import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupEntity } from '../group/group.entity';
import { UserEntity } from '../user/user.entity';
import { BusinessLogicException, BusinessError} from '../shared/interceptors/business-errors/business-errors';

@Injectable()
export class GroupUserService {
    constructor(
        @InjectRepository(GroupEntity)
        private readonly groupRepository: Repository<GroupEntity>,
    
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) {}
    
    async addOwnerGroup(groupId: string, userId: string): Promise<GroupEntity> {
      const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
      if (!user)
        throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
    
      const group: GroupEntity = await this.groupRepository.findOne({where: {id: groupId}, relations: ["members", "owner", "calendar"]})
      if (!group)
        throw new BusinessLogicException("The group with the given id was not found", BusinessError.NOT_FOUND);
  
      group.owner = user;
      return await this.groupRepository.save(group);
    }

    async findOwnerByGroupId(groupId: string): Promise<UserEntity> {
      const group: GroupEntity = await this.groupRepository.findOne({where: {id: groupId}, relations: ["owner"]});
      if (!group)
        throw new BusinessLogicException("The group with the given id was not found", BusinessError.NOT_FOUND)
      return group.owner;
    }

    async addUserGroup(groupId: string, userId: string): Promise<GroupEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND);
      
        const group: GroupEntity = await this.groupRepository.findOne({where: {id: groupId}, relations: ["members", "owner", "calendar"]})
        if (!group)
          throw new BusinessLogicException("The group with the given id was not found", BusinessError.NOT_FOUND);
    
        group.members = [...group.members, user];
        return await this.groupRepository.save(group);
      }
    
    async findUserByGroupIdUserId(groupId: string, userId: string): Promise<UserEntity> {
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
       
        const group: GroupEntity = await this.groupRepository.findOne({where: {id: groupId}, relations: ["members"]});
        if (!group)
          throw new BusinessLogicException("The group with the given id was not found", BusinessError.NOT_FOUND)
   
        const groupUser: UserEntity = group.members.find(e => e.id === user.id);
   
        if (!groupUser)
          throw new BusinessLogicException("The user with the given id is not associated to the group", BusinessError.PRECONDITION_FAILED)
   
        return groupUser;
    }
    
    async findMembersByGroupId(groupId: string): Promise<UserEntity[]> {
        const group: GroupEntity = await this.groupRepository.findOne({where: {id: groupId}, relations: ["members"]});
        if (!group)
          throw new BusinessLogicException("The group with the given id was not found", BusinessError.NOT_FOUND)
       
        return group.members;
    }
    
    async associateMembersGroup(groupId: string, members: UserEntity[]): Promise<GroupEntity> {
        const group: GroupEntity = await this.groupRepository.findOne({where: {id: groupId}, relations: ["members"]});
    
        if (!group)
          throw new BusinessLogicException("The group with the given id was not found", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < members.length; i++) {
          const user: UserEntity = await this.userRepository.findOne({where: {id: members[i].id}});
          if (!user)
            throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
        }
    
        group.members = members;
        return await this.groupRepository.save(group);
      }
    
    async deleteUserGroup(groupId: string, userId: string){
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
        if (!user)
          throw new BusinessLogicException("The user with the given id was not found", BusinessError.NOT_FOUND)
    
        const group: GroupEntity = await this.groupRepository.findOne({where: {id: groupId}, relations: ["members"]});
        if (!group)
          throw new BusinessLogicException("The group with the given id was not found", BusinessError.NOT_FOUND)
    
        const groupUser: UserEntity = group.members.find(e => e.id === user.id);
    
        if (!groupUser)
            throw new BusinessLogicException("The user with the given id is not associated to the group", BusinessError.PRECONDITION_FAILED)
 
        group.members = group.members.filter(e => e.id !== userId);
        await this.groupRepository.save(group);
    }  

  }
