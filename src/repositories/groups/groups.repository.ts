import { Injectable } from '@nestjs/common';
import { GroupRequest } from 'src/dtos/groups/group.dto';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { BaseRepositoryImpl } from '../baseRepository';

@Injectable()
export class GroupsRepository extends BaseRepositoryImpl<GroupRequest> {
  constructor(prisma: PrismaService) {
    super(prisma, 'group');
  }

  async findGroupByName(groupName: string) {
    if (!groupName) {
      throw new Error('Group name must be provided');
    }
    return this.prisma.group.findUnique({
      where: { groupName },
      include: {
        costs: true,
        presents: true,
      },
    });
  }

  async findById(id: number) {
    if (!id || isNaN(id)) {
      throw new Error('A valid ID must be provided');
    }
    return this.prisma.group.findUnique({
      where: { id: Number(id) },
      include: {
        costs: true,
        presents: true,
      },
    });
  }

  async findAll() {
    const groups = await this.prisma.group.findMany({
      include: {
        costs: true,
        presents: true,
      },
    });
    return groups ?? [];
  }

  async updateData(id: number, data: Partial<GroupRequest>) {
    if (!id || isNaN(id)) {
      throw new Error('A valid ID must be provided');
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Data to update must be provided');
    }
    return this.prisma.group.update({
      where: { id: Number(id) },
      data,
    });
  }

  async deleteData(id: number) {
    if (!id || isNaN(id)) {
      throw new Error('A valid ID must be provided');
    }
    const number = Number(id);
    return this.prisma.group.delete({
      where: { id: number },
    });
  }
}
