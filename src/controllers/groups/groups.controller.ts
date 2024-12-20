import { Controller, Get, Param } from '@nestjs/common';
import { GroupsService } from 'src/services/groups/groups.service';
import { GroupRequest } from 'src/dtos/groups/group.dto';
import { BaseController } from '../baseController';

@Controller('groups')
export class GroupsController extends BaseController<GroupRequest> {
  constructor(private readonly groupsService: GroupsService) {
    super(groupsService, 'group');
  }

  @Get(':id')
  async getGroupById(@Param('id') id: number) {
    try {
      const response = await this.groupsService.getById(id);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
