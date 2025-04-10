import { Post, Get, Delete, Patch, Param, Body, Logger } from '@nestjs/common';
import { IProcessData } from 'src/interfaces/iProcess-data';
import { TestService } from '../services/test/test.service';

export abstract class BaseController<T> implements IProcessData<T> {
  protected readonly logger: Logger;

  protected constructor(
    public readonly service: any,
    private readonly name: string,
  ) {
    this.logger = new Logger(name);
  }

  @Post()
  async addData(@Body() data: T): Promise<{ result: T }> {
    this.logger.log(
      `Received request to add new ${this.name}: ${JSON.stringify(data)}`,
    );
    try {
      const response = await this.service.addData(data);
      this.logger.log(
        `${this.name} added successfully: ${JSON.stringify(response)}`,
      );
      return { result: response };
    } catch (error) {
      this.logger.error(
        `Error while adding ${this.name}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Get()
  async getData(): Promise<{ results: T[] }> {
    this.logger.log(`Received request to fetch all ${this.name}s`);
    try {
      const results = await this.service.getData();
      this.logger.log(
        `${this.name}s fetched successfully: ${JSON.stringify(results)}`,
      );
      return { results };
    } catch (error) {
      this.logger.error(
        `Error while fetching ${this.name}s: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete(':id')
  async deleteData(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.log(`Received request to delete ${this.name} with id: ${id}`);
    try {
      const response = await this.service.deleteData(id);
      this.logger.log(`${this.name} with id ${id} deleted successfully`);
      return { message: response };
    } catch (error) {
      this.logger.error(
        `Error while deleting ${this.name} with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  @Patch(':id')
  async updateData(
    @Param('id') id: string | number,
    @Body() data: Partial<T>,
  ): Promise<{ updatedResult: T }> {
    this.logger.log(
      `Received request to update ${this.name} with id: ${typeof id}`,
    );
    this.logger.log(`Update data for ${this.name}: ${JSON.stringify(data)}`);
    try {
      const response = await this.service.updateData(id, data);
      this.logger.log(
        `${this.name} with id ${id} updated successfully: ${JSON.stringify(response)}`,
      );
      return { updatedResult: response };
    } catch (error) {
      this.logger.error(
        `Error while updating ${this.name} with id ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
