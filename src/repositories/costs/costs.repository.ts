import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../modules/prisma/services/prisma.service';
import { CostRequest } from '../../dtos/costs/costs.dto.';

@Injectable()
export class CostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(cost: CostRequest) {
    return this.prisma.cost.create({
      data: cost,
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

  async update(id: string, data: Partial<CostRequest>) {
    return this.prisma.cost.update({
      where: { id },
      data: data,
    });
  }

  async delete(id: string) {
    return this.prisma.cost.delete({
      where: { id },
    });
  }
}
