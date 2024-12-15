import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  Patch,
} from '@nestjs/common';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { PresentsService } from 'src/services/presents/presents.service';

@Controller('presents')
export class PresentsController {
  constructor(private readonly presentsService: PresentsService) {}

  @Post()
  async addPresent(
    @Body() data: PresentRequest,
  ): Promise<{ present: PresentRequest }> {
    try {
      const response = await this.presentsService.addPresent(data);
      return { present: response };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getPresents(): Promise<{ presents: PresentRequest[] }> {
    try {
      return { presents: await this.presentsService.getPresents() };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deletePresent(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const response = await this.presentsService.deletePresentById(id);
      return { message: response };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updatePresent(
    @Param('id') id: string,
    @Body() data: Partial<PresentRequest>,
  ): Promise<{ updatedPresent: PresentRequest }> {
    try {
      const response = await this.presentsService.updatePresent(id, data);
      return { updatedPresent: response };
    } catch (error) {
      throw error;
    }
  }
}
