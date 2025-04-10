import { Controller, Get } from '@nestjs/common';
import { CostsService } from 'src/services/costs/costs.service';
import { CostRequest } from 'src/dtos/costs/costs.dto.';
import { BaseController } from '../baseController';
import { TestService } from '../../services/test/test.service';

@Controller('costs')
export class CostsController extends BaseController<CostRequest> {
  constructor(private readonly costsService: CostsService, private readonly testService: TestService) {
    super(costsService, 'cost');
  }

  @Get('test')
  async getDataEvent() {
    await this.testService.getEvents().subscribe(value => console.log(value));
  }
}
