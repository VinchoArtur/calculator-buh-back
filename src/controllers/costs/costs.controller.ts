import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CostRequest } from 'src/dtos/costs/costs.dto.';
import { CostsService } from 'src/services/costs/costs.service';

@Controller('costs')
export class CostsController {
  constructor(private readonly addCostService: CostsService) {}

  private readonly logger = new Logger(CostsController.name);

  @Post()
  async addCost(@Body() data: CostRequest): Promise<{ cost: CostRequest }> {
    try {
      this.logger.error('Received data:', JSON.stringify(data));
      const response = await this.addCostService.addCosts(data);
      return { cost: response }; // Успешный результат возвращается напрямую
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
      throw error;
    }
  }

  @Delete(':id')
  async deleteCost(@Param('id') id: string): Promise<{ message: string }> {
    try {
      this.logger.log(id);
      const response = await this.addCostService.deleteCostById(id);
      return { message: response };
    } catch (error) {
      this.logger.error('Error while deleting cost:', error.message);
      throw error;
    }
  }

  @Patch(':id')
  async updateCost(
    @Param('id') id: string,
    @Body() updatedCost: Partial<CostRequest>,
  ): Promise<{ updatedCost: CostRequest }> {
    try {
      const response = await this.addCostService.updateCost(id, updatedCost);
      return { updatedCost: response };
    } catch (error) {
      throw error;
    }
  }
}
