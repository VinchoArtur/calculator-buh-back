import { Injectable } from '@nestjs/common';
import { CostRequest } from 'src/dtos/costs/costs.dto.';
import { PrismaService } from 'src/modules/prisma/services/prisma.service';
import { BaseRepositoryImpl } from '../baseRepository';

@Injectable()
export class CostsRepository extends BaseRepositoryImpl<CostRequest> {
  constructor(prisma: PrismaService) {
    super(prisma, 'cost');
  }

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
}
