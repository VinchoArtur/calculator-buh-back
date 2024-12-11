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
  async addCost(@Body() data: CostRequest): Promise<string> {
    try {
      this.logger.error('Received data:', JSON.stringify(data));
      return await this.addCostService.addCosts(data); // Успешный результат возвращается напрямую
    } catch (error) {
      this.logger.error('Error while adding cost:', error.message);
      throw error; // Перебрасываем ошибку, чтобы клиент получил соответствующий код ответа
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

  @Delete(':id')
  async deleteCost(@Param('id') id: string): Promise<string> {
    try {
      return await this.addCostService.deleteCostById(id);
    } catch (error) {
      this.logger.error('Error while deleting cost:', error.message);
      throw error;
    }
  }
}
