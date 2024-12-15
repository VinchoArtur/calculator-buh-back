import { Controller } from '@nestjs/common';
import { PresentRequest } from 'src/dtos/presents/presents.dto';
import { PresentsService } from 'src/services/presents/presents.service';
import { BaseController } from '../baseController';

@Controller('presents')
export class PresentsController extends BaseController<PresentRequest> {
  constructor(public readonly service: PresentsService) {
    super(service);
  }
}
