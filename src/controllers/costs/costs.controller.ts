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
    this.logger.log(`Received request to add a cost: ${JSON.stringify(data)}`);
    try {
      const response = await this.addCostService.addCosts(data);
      this.logger.log(`Cost added successfully: ${JSON.stringify(response)}`);
      return { cost: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while adding a cost: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get()
  async getCosts() {
    this.logger.log('Received request to fetch all costs');
    try {
      const response = await this.addCostService.getCosts();
      this.logger.log(
        `Fetched costs successfully: ${JSON.stringify(response)}`,
      );
      return { costs: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching costs: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  async deleteCost(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`Received request to delete cost with ID: ${id}`);
    try {
      const response = await this.addCostService.deleteCostById(id);
      this.logger.log(`Cost deleted successfully with ID: ${id}`);
      return { message: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while deleting cost with ID: ${id}`,
        error.message,
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  async updateCost(
    @Param('id') id: string,
    @Body() updatedCost: Partial<CostRequest>,
  ): Promise<{ updatedCost: CostRequest }> {
    this.logger.log(
      `Received request to update cost with ID: ${id}, Data: ${JSON.stringify(
        updatedCost,
      )}`,
    );
    try {
      const response = await this.addCostService.updateCost(id, updatedCost);
      this.logger.log(
        `Cost updated successfully with ID: ${id}, Updated Data: ${JSON.stringify(
          response,
        )}`,
      );
      return { updatedCost: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while updating cost with ID: ${id}`,
        error.message,
        error.stack,
      );
      throw error;
    }
  }
}
