import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { CostRequest } from 'src/dtos/costs/i-costs';
import { AddCostsService } from 'src/services/add-costs/add-costs.service';

@Controller('add-costs')
export class AddCostsController {
  constructor(private readonly addCostService: AddCostsService) {}

  private readonly logger = new Logger(AddCostsController.name);

  @Post()
  async addCost(@Body() data: CostRequest): Promise<{ message: string }> {
    try {
      this.logger.error('Received data:', JSON.stringify(data));
      const response = await this.addCostService.addCosts(data);
      return { message: response }; // Успешный результат возвращается напрямую
    } catch (error) {
      this.logger.error('Error while adding cost:', error.message);
      throw error; // Перебрасываем ошибку, чтобы клиент получил соответствующий код ответа
    }
  }

  @Get()
  async getCosts() {
    try {
      return { costs: await this.addCostService.getCosts() };
    } catch (error) {
      return `error: ${error.message}`;
    }
  }

  @Delete(':id')
  async deleteCost(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const response = await this.addCostService.deleteCostById(id);
      return { message: response };
    } catch (error) {
      this.logger.error('Error while deleting cost:', error.message);
      throw error;
    }
  }
}
