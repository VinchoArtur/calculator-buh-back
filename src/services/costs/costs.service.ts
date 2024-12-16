import { Injectable, NotFoundException } from '@nestjs/common';
import { CostsRepository } from '../../repositories/costs/costs.repository';
import { CostRequest } from '../../dtos/costs/costs.dto.';

@Injectable()
export class CostsService {
  constructor(private readonly costsRepository: CostsRepository) {}

  public async addCosts(cost: CostRequest): Promise<CostRequest> {
    return await this.costsRepository.create(cost);
  }

  public async getCosts(): Promise<CostRequest[]> {
    return await this.costsRepository.findAll();
  }

  public async deleteCostById(id: string): Promise<string> {
    const cost = await this.costsRepository.findById(id);

    if (!cost) {
      throw new NotFoundException(`Cost with ID ${id} not found`);
    }

    await this.costsRepository.delete(id);

    return `Cost with ID ${id} deleted successfully`;
  }

  public async updateCost(
    id: string,
    updatedCost: Partial<CostRequest>,
  ): Promise<CostRequest> {
    const cost = await this.costsRepository.findById(id);

    if (!cost) {
      throw new NotFoundException(`Cost with ID ${id} not found`);
    }

    return await this.costsRepository.update(id, updatedCost);
  }
}
