import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { CostRequest } from 'src/dtos/costs/i-costs';

@Injectable()
export class AddCostsService {
  public async addCosts(cost: CostRequest) {
    const fileName = `data-${Date.now()}.json`;
    const filePath = join(__dirname, '..', '..', '..', 'assets', fileName);
    await writeFile(filePath, JSON.stringify(cost, null, 2), 'utf8');

    return filePath;
  }
}
