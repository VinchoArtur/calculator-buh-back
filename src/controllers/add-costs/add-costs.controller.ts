import { Body, Controller, Get, Post } from '@nestjs/common';
import { CostRequest } from 'src/dtos/costs/i-costs';
import { AddCostsService } from 'src/services/add-costs/add-costs.service';

@Controller('add-costs')
export class AddCostsController {
  constructor(private readonly addCostService: AddCostsService) {}

  @Post()
  async addCost(@Body() data: CostRequest) {
    try {
      return await this.addCostService.addCosts(data);
    } catch (error) {
      return `error: ${error.message}`;
    }
  }

  @Get()
  async getCosts() {
    try {
      return await this.addCostService.getCosts();
    } catch (error) {
      return `error: ${error.message}`;
    }
  }
}
