import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRequest } from 'src/dtos/groups/group.dto';
import { GroupsRepository } from 'src/repositories/groups/groups.repository';
import { BaseService } from '../baseService';

@Injectable()
export class GroupsService extends BaseService<
  GroupRequest,
  { groupId: number }
> {
  constructor(private readonly groupsRepository: GroupsRepository) {
    super(groupsRepository);
  }

  protected getModelName(): string {
    return 'Group';
  }

  async addData(data: { groupName: string }): Promise<{ groupId: number }> {
    const existingGroup = await this.groupsRepository.findGroupByName(
      data.groupName,
    );

    if (existingGroup) {
      throw new BadRequestException({
        message: 'Group already exists',
        groupId: existingGroup.id,
      });
    }

    const newGroup = await this.groupsRepository.createGroup(data.groupName);
    return { groupId: newGroup.id };
  }
}
