import {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { IProcessData } from '../interfaces/iProcess-data';

export abstract class BaseController<T> implements IProcessData<T> {
  protected constructor(public readonly service: any) {}

  @Post()
  async addData(@Body() data: T): Promise<{ result: T }> {
    try {
      const response = await this.service.addData(data);
      return { result: response };
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async getData(): Promise<{ results: T[] }> {
    try {
      const results = await this.service.getData();
      return { results };
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async deleteData(@Param('id') id: string): Promise<{ message: string }> {
    try {
      const response = await this.service.deleteData(id);
      return { message: response };
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id')
  async updateData(
    @Param('id') id: string,
    @Body() data: Partial<T>,
  ): Promise<{ updatedResult: T }> {
    try {
      const response = await this.service.updateData(id, data);
      return { updatedResult: response };
    } catch (error) {
      throw error;
    }
  }
}
