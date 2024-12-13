import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { FileService } from 'src/services/file/file.service';
import { CostRequest } from 'src/dtos/costs/costs.dto.';
import { v4 } from 'uuid';

@Injectable()
export class AddCostsService {
  private readonly assetsFolder = join(__dirname, '..', '..', '..', 'assets');
  private readonly fileName = `data.json`;
  private readonly filePath = join(this.assetsFolder, this.fileName);
  private readonly Logger = new Logger(AddCostsService.name);

  constructor(private readonly fileService: FileService) {}

  public async addCosts(cost: CostRequest): Promise<CostRequest> {
    try {
      const newCost: CostRequest = { ...cost, id: v4() };
      this.Logger.log(newCost);

      if (!existsSync(this.assetsFolder)) {
        await mkdir(this.assetsFolder, { recursive: true });
      }

      const costs = await this.fileService.readFile<CostRequest>(this.filePath);

      costs.push(newCost);

      await this.fileService.writeFile(this.filePath, costs);

      return newCost;
    } catch (e) {
      this.Logger.error('Error adding cost:', e.message);
      throw e;
    }
  }

  public async getCosts(): Promise<CostRequest[]> {
    return this.fileService.readFile<CostRequest>(this.filePath);
  }

  public async deleteCostById(id: string): Promise<string> {
    const costs = await this.fileService.readFile<CostRequest>(this.filePath);

    const index = costs.findIndex((cost) => cost.id === id);

    if (index === -1) {
      throw new NotFoundException(`Cost with ID ${id} not found`);
    }
    costs.splice(index, 1);

    await this.fileService.writeFile(this.filePath, costs);

    return `Cost with ID ${id} deleted successfully`;
  }

  async updateCost(
    id: string,
    updatedCost: Partial<CostRequest>,
  ): Promise<CostRequest> {
    this.Logger.log(updatedCost);
    const costs = await this.fileService.readFile<CostRequest>(this.filePath);
    const index = costs.findIndex((cost) => cost.id === id);

    if (index === -1) {
      throw new NotFoundException(`Cost with ID ${id} not found`);
    }

    const updatedRecord = { ...costs[index], ...updatedCost };
    this.Logger.log(updatedRecord);

    costs[index] = updatedRecord;

    await this.fileService.writeFile(this.filePath, costs);

    return updatedRecord;
  }
}
