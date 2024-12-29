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
    const existingGroup = await this.groupsRepository.findGroupByName(requestData.groupName);

    if (existingGroup) {
      throw new BadRequestException({
        message: 'Group already exists',
        groupId: existingGroup.id,
      });
    }

    // Теперь мы используем groupType, а не type
    const groupRequest = {
      groupName: requestData.groupName,
      type: requestData.type,  // Используем groupType, а не type
    };

    const newGroup = await this.groupsRepository.createData(groupRequest);

    if (newGroup) {
      // Обновляем данные в зависимости от типа группы (presents или costs)
      switch (newGroup.type) {
        case 'presents':
          await this.groupsRepository.updatePresentsData(requestData.groupId, newGroup.id);
          break;
        case 'costs':
          await this.groupsRepository.updateCostsData(requestData.groupId, newGroup.id);
          break;
      }
    }

    return { groupId: newGroup.id };
  }



}
