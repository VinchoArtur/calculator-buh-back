import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GroupRequest } from 'src/dtos/groups/group.dto';
import { GroupsRepository } from 'src/repositories/groups/groups.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly groupsRepository: GroupsRepository) {}

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

  async getData() {
    return this.groupsRepository.getAllGroups();
  }

  async getGroupById(id: number) {
    const group = await this.groupsRepository.findGroupById(id);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async updateData(id: number, data: GroupRequest) {
    const group = await this.getGroupById(+id);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return this.groupsRepository.updateGroup(+id, data);
  }

  async deleteData(id: number) {
    const group = await this.getGroupById(+id);

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    this.groupsRepository.deleteGroupById(+id);

    return `Group with ID ${id} deleted successfully`;
  }
}
