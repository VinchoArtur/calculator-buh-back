import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRequest, RequestGroupDto } from 'src/dtos/groups/group.dto';
import { GroupsRepository } from 'src/repositories/groups/groups.repository';
import { BaseService } from '../baseService';
import { GroupRequestMapper } from '../../mapper/group/group-request-mapper';
import { CostsRepository } from '../../repositories/costs/costs.repository';
import { PresentsRepository } from '../../repositories/presents/present.repository';

@Injectable()
export class GroupsService extends BaseService<RequestGroupDto,{ groupId: number }> {
  constructor(private readonly groupsRepository: GroupsRepository, private readonly costsRepository: CostsRepository, private readonly presentsRepository: PresentsRepository) {
    super(groupsRepository);
  }

  protected getModelName(): string {
    return 'Group';
  }

  async addData(data: RequestGroupDto): Promise<{ groupId: number }> {
    const requestData: GroupRequest = GroupRequestMapper.toRequest(data);
    const existingGroup = await this.groupsRepository.findGroupByName(
      requestData.groupName,
    );

    if (existingGroup) {
      throw new BadRequestException({
        message: 'Group already exists',
        groupId: existingGroup.id,
      });
    }
    const groupRequest = {
      groupName: requestData.groupName,
      groupId: requestData.groupId || [],
      groupType: requestData.groupType,
      type: requestData.groupType,
    };

    const newGroup = await this.groupsRepository.createData(groupRequest);
    if (newGroup) {
      switch (newGroup.type) {
        case 'presents': await this.updatePresentsData(requestData.groupId, newGroup.id);
        break;
        case 'costs' : await this.updateCostsData(requestData.groupId, newGroup.id);
      }
    }

    return { groupId: newGroup.id };
  }

  private async updatePresentsData(data: number[], groupId: number) {
    return await this.presentsRepository.updateFieldByIds(data, 'groupId', groupId);
  }

  private async updateCostsData(data: number[], groupId: number) {
    return await this.costsRepository.updateFieldByIds(data, 'groupId', groupId);
  }
}
