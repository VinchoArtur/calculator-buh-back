import { Controller } from '@nestjs/common';
import { PresentsService } from 'src/services/presents/presents.service';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { BaseController } from '../baseController';

@Controller('presents')
export class PresentsController extends BaseController<PresentRequest> {
  constructor(private readonly presentsService: PresentsService) {
    super(presentsService, 'present');
  }
}
