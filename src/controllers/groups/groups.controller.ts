import { Controller, Get, Param } from '@nestjs/common';
import { GroupsService } from 'src/services/groups/groups.service';
import { GroupRequest, RequestGroupDto } from 'src/dtos/groups/group.dto';
import { BaseController } from '../baseController';

@Controller('groups')
export class GroupsController extends BaseController<GroupRequest> {
  constructor(private readonly groupsService: GroupsService) {
    super(groupsService, 'group');
  }

  @Get(':id')
  async getGroupById(@Param('id') id: number) {
    try {
      return await this.groupsService.getById(id);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getAllGroup() {
    try {
      const requestGroupDtos: RequestGroupDto[] = await this.groupsService.getData();
      return await this.groupsService.prepareResData(requestGroupDtos)
    } catch (error) {
      console.error('Error fetching all groups:', error.message);
      throw new Error('Failed to fetch all groups');
    }
  }
}
