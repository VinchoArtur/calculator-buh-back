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
    return await this.groupsService.getById(id);
  }

  @Get()
  async getAllGroup() {
    const requestGroupDtos: RequestGroupDto[] =
      await this.groupsService.getData();
    return {
      results: await this.groupsService.prepareResData(requestGroupDtos),
    };
  }
}
