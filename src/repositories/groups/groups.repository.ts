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

  async findById(id: number) {
    return this.prisma.group.findUnique({
      where: { id: +id },
      include: {
        costs: true,
        presents: true,
      },
    });
  }

  async findAll() {
    return this.prisma.group.findMany({
      include: {
        costs: true,
        presents: true,
      },
    });
  }

  async updateData(id: number, data: Partial<GroupRequest>) {
    return this.prisma.group.update({
      where: { id: +id },
      data,
    });
  }

  async deleteData(id: number) {
    return this.prisma.group.delete({ where: { id: +id } });
  }
}
