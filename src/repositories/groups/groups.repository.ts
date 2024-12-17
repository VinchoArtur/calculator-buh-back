import { Injectable } from '@nestjs/common';
import { GroupRequest } from 'src/dtos/groups/group.dto';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';

@Injectable()
export class GroupsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createGroup(groupName: string) {
    return this.prisma.group.create({ data: { groupName } });
  }

  async findGroupByName(groupName: string) {
    return this.prisma.group.findUnique({
      where: { groupName },
      include: {
        costs: true,
        presents: true,
      },
    });
  }

  async findGroupById(id: number) {
    return this.prisma.group.findUnique({
      where: { id },
      include: {
        costs: true,
        presents: true,
      },
    });
  }

  async getAllGroups() {
    return this.prisma.group.findMany({
      include: {
        costs: true,
        presents: true,
      },
    });
  }

  async updateGroup(id: number, data: Partial<GroupRequest>) {
    return this.prisma.group.update({
      where: { id },
      data,
    });
  }

  async deleteGroupById(id: number) {
    return this.prisma.group.delete({ where: { id } });
  }
}
