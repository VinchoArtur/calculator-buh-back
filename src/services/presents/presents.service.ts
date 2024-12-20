import { Injectable } from '@nestjs/common';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { PresentsRepository } from '../../repositories/presents/present.repository';
import { BaseService } from '../baseService';

@Injectable()
export class PresentsService extends BaseService<PresentRequest> {
  constructor(private readonly presentsRepository: PresentsRepository) {
    super(presentsRepository);
  }

  protected getModelName(): string {
    return 'Present';
  }
}
