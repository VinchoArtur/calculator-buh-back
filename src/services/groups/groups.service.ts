import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRequest, RequestGroupDto } from 'src/dtos/groups/group.dto';
import { GroupsRepository } from 'src/repositories/groups/groups.repository';
import { BaseService } from '../baseService';
import { GroupRequestMapper } from '../../mapper/group/group-request-mapper';
import { CostsRepository } from '../../repositories/costs/costs.repository';
import { PresentsRepository } from '../../repositories/presents/present.repository';

@Injectable()
export class GroupsService extends BaseService<RequestGroupDto, { groupId: number }> {
  constructor(private readonly groupsRepository: GroupsRepository, private readonly costsRepository: CostsRepository, private readonly presentsRepository: PresentsRepository) {
    super(groupsRepository);
  }

  protected getModelName(): string {
    return 'Group';
  }

  async addData(data: RequestGroupDto): Promise<{ groupId: number, name: string, type: string, items: number[], data: any[] }> {
    const requestData: GroupRequest = GroupRequestMapper.toRequest(data);
    const existingGroup = await this.groupsRepository.findGroupByName(requestData.groupName);

    if (existingGroup) {
      throw new BadRequestException({
        message: 'Group already exists',
        groupId: existingGroup.id,
      });
    }

    const groupRequest = {
      groupName: requestData.groupName,
      type: requestData.type,
    };

    const newGroup = await this.groupsRepository.createData(groupRequest);
    let items: any[] = [];
    if (newGroup) {
      switch (newGroup.type) {
        case 'presents':
          await this.groupsRepository.updatePresentsData(requestData.groupIds, newGroup.id);
          const presentItems = await this.presentsRepository.findByIds(requestData.groupIds);
          items.push(presentItems);
          break;
        case 'costs':
          await this.groupsRepository.updateCostsData(requestData.groupIds, newGroup.id);
          const costItems = await this.presentsRepository.findByIds(requestData.groupIds);
          items.push(costItems);
          break;
      }
    }

    return { groupId: newGroup.id, name: newGroup.groupName, type: newGroup.type, items: requestData.groupIds, data: items };
  }


}
