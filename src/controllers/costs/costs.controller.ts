import { Controller } from '@nestjs/common';
import { BaseController } from '../baseController';
import { CostRequest } from '../../dtos/costs/costs.dto.';
import { CostsService } from '../../services/costs/costs.service';

@Controller('costs')
export class CostsController extends BaseController<CostRequest> {
  constructor(public readonly service: CostsService) {
    super(service);
  }
}
