import { Controller } from '@nestjs/common';
import { CostsService } from 'src/services/costs/costs.service';
import { CostRequest } from 'src/dtos/costs/costs.dto.';
import { BaseController } from '../baseController';

@Controller('costs')
export class CostsController extends BaseController<CostRequest> {
  constructor(private readonly costsService: CostsService) {
    super(costsService, 'cost');
  }
}
