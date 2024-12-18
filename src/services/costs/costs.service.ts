import { Injectable } from '@nestjs/common';
import { CostsRepository } from '../../repositories/costs/costs.repository';
import { CostRequest } from 'src/dtos/costs/costs.dto.';
import { BaseService } from '../baseService';

@Injectable()
export class CostsService extends BaseService<CostRequest> {
  constructor(private readonly costsRepository: CostsRepository) {
    super(costsRepository);
  }

  protected getModelName(): string {
    return 'Cost';
  }
}
