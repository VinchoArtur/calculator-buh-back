import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { join } from 'path';
import { v4 } from 'uuid';
import { FileService } from '../file/file.service';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';

@Injectable()
export class PresentsService {
  private readonly assetsFolder = join(__dirname, '..', '..', '..', 'assets');
  private readonly fileName = 'data-presents.json';
  private readonly filePath = join(this.assetsFolder, this.fileName);
  private readonly Logger = new Logger(PresentsService.name);

  constructor(private readonly fileService: FileService) {}

  public async addPresent(present: PresentRequest): Promise<PresentRequest> {
    try {
      const newPresent = { ...present, id: v4() };
      this.Logger.log(newPresent);

      if (!existsSync(this.assetsFolder)) {
        await mkdir(this.assetsFolder, { recursive: true });
      }

      const presents = await this.fileService.readFile<PresentRequest>(
        this.filePath,
      );
      presents.push(newPresent);
      await this.fileService.writeFile(this.filePath, presents);
      return newPresent;
    } catch (error) {
      throw error;
    }
  }

  public async getPresents(): Promise<PresentRequest[]> {
    return this.fileService.readFile<PresentRequest>(this.filePath);
  }

  public async deletePresentById(id: string): Promise<string> {
    const presents = await this.fileService.readFile<PresentRequest>(
      this.filePath,
    );
    const index = presents.findIndex((present) => present.id === id);

    if (index === -1) {
      throw new NotFoundException(`Present with ID ${id} not found`);
    }

    presents.splice(index, 1);
    await this.fileService.writeFile(this.filePath, presents);

    return `Present with ID ${id} deleted successfully`;
  }

  public async updatePresent(
    id: string,
    updatedPresent: Partial<PresentRequest>,
  ): Promise<PresentRequest> {
    const presents = await this.fileService.readFile<PresentRequest>(
      this.filePath,
    );
    const index = presents.findIndex((present) => present.id === id);

    if (index === -1) {
      throw new NotFoundException(`Present with ID ${id} not found`);
    }

    const updatedRecord = { ...presents[index], ...updatedPresent };
    presents[index] = updatedRecord;

    await this.fileService.writeFile(this.filePath, presents);
    return updatedRecord;
  }
}
