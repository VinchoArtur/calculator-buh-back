import { Injectable, NotFoundException } from '@nestjs/common';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { PresentsRepository } from '../../repositories/presents/present.repository';

@Injectable()
export class PresentsService {
  constructor(private readonly presentsRepository: PresentsRepository) {}

  public async addPresent(present: PresentRequest): Promise<PresentRequest> {
    return await this.presentsRepository.create(present);
  }

  public async getPresents(): Promise<PresentRequest[]> {
    return this.presentsRepository.findAll();
  }

  public async deletePresentById(id: string): Promise<string> {
    const present = await this.presentsRepository.findById(id);

    if (!present) {
      throw new NotFoundException(`Present with ID ${id} not found`);
    }

    await this.presentsRepository.delete(id);

    return `Present with ID ${id} deleted successfully`;
  }

  public async updatePresent(
    id: string,
    updatedPresent: Partial<PresentRequest>,
  ): Promise<PresentRequest> {
    const present = await this.presentsRepository.findById(id);

    if (!present) {
      throw new NotFoundException(`Present with ID ${id} not found`);
    }

    return await this.presentsRepository.update(id, updatedPresent);
  }
}
