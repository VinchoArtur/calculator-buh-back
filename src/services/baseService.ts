import { NotFoundException } from '@nestjs/common';

export abstract class BaseService<T, R = T> {
  constructor(protected readonly repository: any) {}

  async addData(data: T): Promise<R> {
    return await this.repository.create(data);
  }

  async getData(): Promise<T[]> {
    return this.repository.findAll();
  }

  async getById(id: string | number): Promise<T> {
    const data = await this.repository.findById(id);

    if (!data) {
      throw new NotFoundException(
        `${this.getModelName()} with ID ${id} not found`,
      );
    }

    return data;
  }

  async updateData(id: number, updatedData: Partial<T>): Promise<T> {
    await this.getById(id);
    return this.repository.updateData(Number(id), updatedData);
  }

  async deleteData(id: string): Promise<string> {
    await this.getById(id);

    await this.repository.deleteData(id);

    return `${this.getModelName()} with ID ${id} deleted successfully`;
  }

  protected abstract getModelName(): string;
}
