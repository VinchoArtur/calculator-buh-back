import { BadRequestException, Injectable } from '@nestjs/common';
import { GroupRequest, RequestGroupDto } from 'src/dtos/groups/group.dto';
import { GroupsRepository } from 'src/repositories/groups/groups.repository';
import { BaseService } from '../baseService';
import { GroupRequestMapper } from '../../mapper/group/group-request-mapper';
import { CostsRepository } from '../../repositories/costs/costs.repository';
import { PresentsRepository } from '../../repositories/presents/present.repository';
import { CostGroupRepository } from '../../repositories/groups/cost-group.repository';
import { CostRequest } from '../../dtos/costs/costs.dto.';
import { PresentGroupRepository } from '../../repositories/groups/present-group.repository';
import { PresentRequest } from '../../dtos/presents/presents.dto';

@Injectable()
export class GroupsService extends BaseService<
  RequestGroupDto,
  { id: number }
> {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly costsRepository: CostsRepository,
    private readonly presentsRepository: PresentsRepository,
    private readonly costGroupRepository: CostGroupRepository,
    private readonly presentGroupRepository: PresentGroupRepository,
  ) {
    super(groupsRepository);
  }

  protected getModelName(): string {
    return 'Group';
  }

  async addData(data: RequestGroupDto): Promise<{
    id: number;
    name: string;
    type: string;
    items: number[];
    data: any[];
  }> {
    const requestData: GroupRequest = GroupRequestMapper.toRequest(data);
    const existingGroup = await this.groupsRepository.findGroupByName(
      requestData.groupName,
    );

    if (existingGroup && existingGroup.type === requestData.type) {
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
          await this.groupsRepository.updatePresentsData(
            requestData.groupIds,
            newGroup.id,
          );
          const presentItems = await this.presentsRepository.findByIds(
            requestData.groupIds,
          );
          items = presentItems;
          break;
        case 'costs':
          await this.groupsRepository.updateCostsData(
            requestData.groupIds,
            newGroup.id,
          );
          const costItems = await this.costsRepository.findByIds(
            requestData.groupIds,
          );
          items = costItems;
          break;
      }
    }

    return {
      id: newGroup.id,
      name: newGroup.groupName,
      type: newGroup.type,
      items: requestData.groupIds,
      data: items,
    };
  }

  public async prepareResData(
    requestGroupDtos: RequestGroupDto[],
  ): Promise<RequestGroupDto[]> {
    return await Promise.all(
      requestGroupDtos.map(async (group) => {
        if (group.type === 'costs') {
          const costIds = group.costs.map((cost) => cost.groupId);
          group.data = (await this.getCostsData(costIds)) ?? [];
        } else if (group.type === 'presents') {
          const presentsIds = group.presents.map((present) => present.groupId);
          group.data = (await this.getPresentsData(presentsIds)) ?? [];
        }
        return group;
      }),
    );
  }

  public async getCostsData(ids: number[]): Promise<CostRequest> {
    const costGroupData: { groupId: number; costId: number }[] =
      await this.costGroupRepository.findByGroupIds(ids);
    if (costGroupData && costGroupData.length > 0) {
      const costIds = costGroupData
        .filter((res) => res.costId)
        .map((res) => res.costId);
      if (costIds && costIds.length > 0) {
        return await this.costsRepository.findByIds(costIds);
      }
    }
  }

  async getPresentsData(ids: number[]): Promise<PresentRequest> {
    const presentGroupData: {
      groupId: number;
      presentId: number;
    }[] = await this.presentGroupRepository.findByGroupIds(ids);
    if (presentGroupData && presentGroupData.length > 0) {
      const presentIds = presentGroupData
        .filter((present) => present.presentId)
        .map((res) => res.presentId);
      if (presentIds && presentIds.length > 0) {
        return await this.presentsRepository.findByIds(presentIds);
      }
    }
  }
}
