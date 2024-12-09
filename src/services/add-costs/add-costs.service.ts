import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { CostRequest } from 'src/dtos/costs/i-costs';
import { v4 } from 'uuid';

@Injectable()
export class AddCostsService {
  private readonly assetsFolder = join(__dirname, '..', '..', '..', 'assets');
  private readonly fileName = `data.json`;
  private readonly filePath = join(this.assetsFolder, this.fileName);
  private readonly Logger = new Logger(AddCostsService.name);

  public async addCosts(cost: CostRequest) {
    try {
      const newCost: CostRequest = { ...cost, id: v4() };
      this.Logger.log(cost);
      if (!existsSync(this.assetsFolder)) {
        await mkdir(this.assetsFolder, { recursive: true });
      }

      let costs: CostRequest[] = [];

      if (existsSync(this.filePath)) {
        const existingData = await readFile(this.filePath, 'utf8');
        costs = JSON.parse(existingData);
      }

      costs.push(newCost);

      await writeFile(this.filePath, JSON.stringify(costs, null, 2), 'utf8');

      return `Cost added successfully! Saved at: ${this.filePath}`;
    } catch (e) {
      return e;
    }
  }

  public async getCosts(): Promise<CostRequest[]> {
    if (!existsSync(this.filePath)) {
      return [];
    }

    const data = await readFile(this.filePath, 'utf8');
    return JSON.parse(data);
  }
}
