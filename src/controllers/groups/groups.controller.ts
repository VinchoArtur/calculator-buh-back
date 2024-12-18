import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { GroupRequest } from 'src/dtos/groups/group.dto';
import { GroupsService } from 'src/services/groups/groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  private readonly logger = new Logger(GroupsController.name);

  @Post()
  async createGroup(@Body() data: GroupRequest) {
    this.logger.log('Creating group with data:', data);
    try {
      const response = await this.groupsService.createGroup(data.groupName);
      this.logger.log('Group created successfully:', response);
      return response;
    } catch (error) {
      this.logger.error('Error while creating group:', error.message);
      throw error;
    }
  }

  @Get()
  async getAllGroups() {
    this.logger.log('Fetching all groups');
    try {
      const response = await this.groupsService.getAllGroups();
      this.logger.log('Groups fetched successfully:', response);
      return response;
    } catch (error) {
      this.logger.error('Error while fetching all groups:', error.message);
      throw error;
    }
  }

  @Get(':id')
  async getGroupById(@Param('id') id: number) {
    this.logger.log(`Fetching group by ID: ${id}`);
    try {
      const response = await this.groupsService.getGroupById(id);
      this.logger.log('Group fetched successfully:', response);
      return response;
    } catch (error) {
      this.logger.error(
        `Error while fetching group by ID: ${id}`,
        error.message,
      );
      throw error;
    }
  }

  @Get('name/:name')
  async getGroupByName(@Param('name') groupName: string) {
    this.logger.log(`Fetching group by name: ${groupName}`);
    try {
      const response = await this.groupsService.getGroupByName(groupName);
      this.logger.log('Group fetched successfully by name:', response);
      return response;
    } catch (error) {
      this.logger.error(
        `Error while fetching group by name: ${groupName}`,
        error.message,
      );
      throw error;
    }
  }

  @Patch(':id')
  async updateGroup(@Param('id') id: number, @Body() data: GroupRequest) {
    this.logger.log(`Updating group with ID: ${id}`);
    this.logger.log('Update data:', data);
    try {
      const response = await this.groupsService.updateGroup(id, data);
      this.logger.log('Group updated successfully:', response);
      return response;
    } catch (error) {
      this.logger.error(
        `Error while updating group with ID: ${id}`,
        error.message,
      );
      throw error;
    }
  }

  @Delete(':id')
  async deleteGroupById(@Param('id') id: number) {
    this.logger.log(`Deleting group by ID: ${id}`);
    try {
      const response = await this.groupsService.deleteGroupById(id);
      this.logger.log('Group deleted successfully:', response);
      return response;
    } catch (error) {
      this.logger.error(
        `Error while deleting group by ID: ${id}`,
        error.message,
      );
      throw error;
    }
  }
}
