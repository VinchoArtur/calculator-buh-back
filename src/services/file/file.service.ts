import { Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class FileService {
  async readFile<T>(filePath: string): Promise<T[]> {
    if (!existsSync(filePath)) {
      return [];
    }
    const data = await readFile(filePath, 'utf8');
    return JSON.parse(data);
  }

  async writeFile<T>(filePath: string, data: T[]): Promise<void> {
    await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}
