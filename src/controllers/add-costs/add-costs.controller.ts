import { Body, Controller, Post } from '@nestjs/common';
import { AddCostsService } from 'src/services/add-costs/add-costs.service';

@Controller('add-costs')
export class AddCostsController {
  constructor(private readonly addCostService: AddCostsService) {}
  @Post()
  async addCost(@Body() data: any) {
    try {
      return await this.addCostService.addCosts(data);
    } catch (error) {
      return `error: ${error.message}`;
    }
  }
}
