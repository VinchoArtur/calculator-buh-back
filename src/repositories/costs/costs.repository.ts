import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/services/prisma.service';
import { CostRequest } from '../../dtos/costs/costs.dto.';

@Injectable()
export class CostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(cost: CostRequest) {
    return this.prisma.cost.create({
      data: {
        name: cost.name,
        price: cost.price,
        hourlyRate: cost.hourlyRate,
        hours: cost.hours,
        costWithoutProfit: cost.costWithoutProfit,
        costWithProfit: cost.costWithProfit,
        group: cost.groupId ? { connect: { id: cost.groupId } } : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.cost.findMany();
  }

  async findById(id: string) {
    return this.prisma.cost.findUnique({
      where: { id },
    });
  }

  async updateData(id: string, data: Partial<CostRequest>) {
    return this.prisma.cost.update({
      where: { id },
      data: data,
    });
  }

  async deleteData(id: string) {
    return this.prisma.cost.delete({
      where: { id },
    });
  }
}
