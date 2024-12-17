import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GroupRequest } from 'src/dtos/groups/group.dto';
import { GroupsService } from 'src/services/groups/groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async createGroup(@Body() data: GroupRequest) {
    return this.groupsService.createGroup(data.groupName);
  }

  @Get()
  async getAllGroups() {
    return this.groupsService.getAllGroups();
  }

  @Get(':id')
  async getGroupById(@Param('id') id: number) {
    return this.groupsService.getGroupById(id);
  }

  @Get('name/:name')
  async getGroupByName(@Param('name') groupName: string) {
    return this.groupsService.getGroupByName(groupName);
  }

  @Patch(':id')
  async updateGroup(@Param('id') id: number, @Body() data: GroupRequest) {
    return this.groupsService.updateGroup(id, data);
  }

  @Delete(':id')
  async deleteGroupById(@Param('id') id: number) {
    return this.groupsService.deleteGroupById(id);
  }
}
