import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';

export interface BaseRepository<T> {
  createData(data: T): Promise<T>;
  findById(id: number): Promise<T | null>;
  findAll(): Promise<T[]>;
  updateData(id: number, data: Partial<T>): Promise<T>;
  deleteData(id: number): Promise<T>;
}

@Injectable()
export class BaseRepositoryImpl<T> implements BaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly model: string,
  ) {}

  async createData(data: T) {
    return this.prisma[this.model].create({ data });
  }

  async findById(id: number) {
    return this.prisma[this.model].findUnique({ where: { id: Number(id) } });
  }

  async findByIds(ids: number[]) {
    return this.prisma[this.model].findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async findByGroupIds(ids: number[]) {
    return this.prisma[this.model].findMany({
      where: {
        groupId: {
          in: ids,
        },
      },
    });
  }

  async findAll() {
    return this.prisma[this.model].findMany();
  }

  async updateData(id: number, data: Partial<T>) {
    return this.prisma[this.model].update({ where: { id }, data });
  }

  async deleteData(id: number) {
    return this.prisma[this.model].delete({ where: { id: Number(id) } });
  }

  async updateFieldByIds(ids: number[], field: keyof T, value: T[keyof T]) {
    return this.prisma[this.model].updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        [field]: value,
      },
    });
  }

  async updatePresentsData(
    presentIds: number[],
    groupId: number,
  ): Promise<void> {
    // Создаем связи в промежуточной таблице PresentGroup
    const presentData = presentIds.map((presentId) => ({
      groupId,
      presentId,
    }));
    await this.prisma.presentGroup.createMany({
      data: presentData,
    });
  }

  async updateCostsData(costIds: number[], groupId: number): Promise<void> {
    // Создаем связи в промежуточной таблице CostGroup
    const costData = costIds.map((costId) => ({
      groupId,
      costId,
    }));
    await this.prisma.costGroup.createMany({
      data: costData,
    });
  }
}
