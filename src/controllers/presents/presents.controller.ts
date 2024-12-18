import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
  Logger,
} from '@nestjs/common';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { PresentsService } from 'src/services/presents/presents.service';

@Controller('presents')
export class PresentsController {
  constructor(private readonly presentsService: PresentsService) {}

  private readonly logger = new Logger(PresentsController.name);

  @Post()
  async addPresent(
    @Body() data: PresentRequest,
  ): Promise<{ present: PresentRequest }> {
    this.logger.log(
      `Received request to add a present: ${JSON.stringify(data)}`,
    );
    try {
      const response = await this.presentsService.addPresent(data);
      this.logger.log(
        `Present added successfully: ${JSON.stringify(response)}`,
      );
      return { present: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while adding a present: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get()
  async getPresents(): Promise<{ presents: PresentRequest[] }> {
    this.logger.log('Received request to fetch all presents');
    try {
      const response = await this.presentsService.getPresents();
      this.logger.log(
        `Fetched presents successfully: ${JSON.stringify(response)}`,
      );
      return { presents: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while fetching presents: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  async deletePresent(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`Received request to delete present with ID: ${id}`);
    try {
      const response = await this.presentsService.deletePresentById(id);
      this.logger.log(`Present deleted successfully with ID: ${id}`);
      return { message: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while deleting present with ID: ${id}`,
        error.message,
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  async updatePresent(
    @Param('id') id: string,
    @Body() updatedPresent: Partial<PresentRequest>,
  ): Promise<{ updatedPresent: PresentRequest }> {
    this.logger.log(
      `Received request to update present with ID: ${id}, Data: ${JSON.stringify(
        updatedPresent,
      )}`,
    );
    try {
      const response = await this.presentsService.updatePresent(
        id,
        updatedPresent,
      );
      this.logger.log(
        `Present updated successfully with ID: ${id}, Updated Data: ${JSON.stringify(
          response,
        )}`,
      );
      return { updatedPresent: response };
    } catch (error) {
      this.logger.error(
        `Error occurred while updating present with ID: ${id}`,
        error.message,
        error.stack,
      );
      throw error;
    }
  }
}
